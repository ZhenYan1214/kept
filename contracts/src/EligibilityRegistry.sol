// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/// @title EligibilityRegistry
/// @notice Who counts as a disaster-affected household, decided by accountable humans.
/// - A household is added to an anonymous Semaphore group only after TWO issuers sign off:
///   the village chief (村長) and the township office (公所) of that village.
/// - Nothing personal goes on-chain: only the Semaphore identity commitment, the household's
///   receipt address (a key it generated itself, used to sign "received" / "not received") and a
///   blinded uniqueness tag (an HMAC of the national ID held by the authority) that blocks
///   double registration across villages.
/// - Only receipt addresses registered here count as households on the custody ledger, so a
///   custodian cannot invent receipt keys and confirm its own payments.
/// - Proxies (social workers, chiefs) who may sign for households that cannot are designated by
///   the township office per disaster and village, publicly.
/// - Groups are per (disaster, damage tier), never per village, to keep anonymity sets large.
/// - Anyone, including people never registered, can file an appeal. Appeal counts and
///   resolution times per village are public, so exclusion is visible without protests.
contract EligibilityRegistry is Ownable {
    enum Role {
        None,
        VillageChief,
        TownshipOffice
    }

    enum RequestStatus {
        None,
        Pending,
        Approved,
        Rejected
    }

    enum AppealStatus {
        None,
        Pending,
        Accepted,
        Rejected
    }

    struct Issuer {
        Role role;
        bool active;
        uint32 region; // village code for chiefs, township code for offices
        uint64 proposed;
        uint64 approved;
        uint64 rejected;
        uint64 revoked;
        uint64 appealsResolved;
        string name;
    }

    struct Disaster {
        bool exists;
        uint8 tierCount;
        uint64 createdAt;
        uint256 verifiedHouseholds;
        string name;
    }

    struct Registration {
        uint256 disasterId;
        uint256 commitment;
        bytes32 uniqueTag;
        address proposer;
        address decider;
        uint64 proposedAt;
        uint64 decidedAt;
        uint32 village;
        uint8 tier;
        RequestStatus status;
        address receipt;
    }

    struct Appeal {
        uint256 disasterId;
        bytes32 evidenceHash;
        bytes32 resolutionHash;
        address resolver;
        uint64 filedAt;
        uint64 resolvedAt;
        uint32 village;
        AppealStatus status;
    }

    struct VillageStats {
        uint32 verified;
        uint32 appealsFiled;
        uint32 appealsPending;
        uint32 appealsAccepted;
        uint32 appealsRejected;
        uint32 unserved; // reported by the township office from its off-chain roster
        uint64 resolutionSecondsTotal;
        uint64 coverageAsOf;
    }

    ISemaphore public immutable semaphore;
    uint256 public immutable merkleTreeDuration;

    mapping(address => Issuer) public issuers;
    mapping(uint32 village => uint32 township) public townshipOf;

    uint256 public disasterCount;
    mapping(uint256 => Disaster) public disasters;
    mapping(uint256 disasterId => mapping(uint8 tier => uint256 groupId)) public tierGroup;
    mapping(uint256 disasterId => mapping(uint8 tier => string)) public tierName;
    mapping(uint256 groupId => uint256) public groupDisaster;
    mapping(uint256 groupId => uint8) public groupTier;
    mapping(uint256 groupId => bool) public isGroup;

    // Enumerable mirrors of state that would otherwise only be in event logs, so clients can read
    // everything with plain calls (public RPCs limit log queries to small block ranges).
    address[] public issuerList;
    uint32[] public villageList;
    /// @dev Leaves of each Semaphore group in insertion order, exactly as its Merkle tree holds them
    /// (a revoked member's leaf is 0), so clients can rebuild the group and make proofs.
    mapping(uint256 groupId => uint256[]) internal _members;
    mapping(uint256 groupId => mapping(uint256 commitment => uint256)) internal _memberIndexPlusOne;

    Registration[] public registrations;
    mapping(bytes32 => bool) public tagUsed; // keccak(disasterId, uniqueTag)
    mapping(bytes32 => bool) public commitmentUsed; // keccak(disasterId, commitment)
    mapping(bytes32 => uint32) public commitmentVillage; // keccak(disasterId, commitment) => village, active members only
    mapping(bytes32 => address) public commitmentReceipt; // keccak(disasterId, commitment) => receipt, active members only
    mapping(bytes32 => bool) public receiptUsed; // keccak(disasterId, receipt), ever proposed or registered
    mapping(bytes32 => uint32) internal _receiptVillage; // keccak(disasterId, receipt) => village, active members only
    mapping(bytes32 => bool) internal _proxy; // keccak(disasterId, village, proxy)

    Appeal[] public appeals;
    mapping(uint256 disasterId => mapping(uint32 village => VillageStats)) public villageStats;

    /// @notice Verified households can say, anonymously and once per period, "I am still waiting for
    /// aid". The count does not depend on custodians recording anything, so a payment that was never
    /// recorded still shows up as a household that is waiting.
    uint64 public constant WAITING_PERIOD = 7 days;
    mapping(uint256 disasterId => mapping(uint64 period => mapping(uint32 village => uint32))) public waitingReports;
    mapping(bytes32 => bool) public waitingNullifierUsed; // keccak(disasterId, period, nullifier)

    event IssuerSet(address indexed issuer, Role role, uint32 region, bool active, string name);
    event VillageSet(uint32 indexed village, uint32 indexed township);
    event DisasterCreated(uint256 indexed disasterId, string name, uint8 tierCount);
    event TierGroupCreated(uint256 indexed disasterId, uint8 tier, uint256 groupId, string name);
    event RegistrationProposed(
        uint256 indexed id, uint256 indexed disasterId, uint32 indexed village, uint8 tier, address proposer
    );
    event RegistrationDecided(uint256 indexed id, bool approved, address indexed decider, bytes32 reasonHash);
    event MemberRevoked(
        uint256 indexed disasterId, uint8 tier, uint32 indexed village, address indexed by, bytes32 reasonHash
    );
    event MemberReplaced(uint256 indexed disasterId, uint8 tier, address indexed by, bytes32 reasonHash);
    event ProxySet(uint256 indexed disasterId, uint32 indexed village, address indexed proxy, bool active, address by);
    event AppealFiled(uint256 indexed id, uint256 indexed disasterId, uint32 indexed village, bytes32 evidenceHash);
    event AppealResolved(uint256 indexed id, bool accepted, address indexed resolver, bytes32 resolutionHash);
    event WaitingReported(uint256 indexed disasterId, uint64 indexed period, uint32 indexed village);
    event CoverageReported(
        uint256 indexed disasterId, uint32 indexed village, uint32 verified, uint32 unserved, address by
    );

    error NotIssuer();
    error OutOfJurisdiction();
    error SameRoleCannotApprove();
    error UnknownDisaster();
    error UnknownTier();
    error DuplicateHousehold();
    error NotPending();
    error UnknownVillage();
    error ZeroAddress();
    error WrongScope();
    error InvalidProof();
    error AlreadyReported();

    constructor(ISemaphore _semaphore, uint256 _merkleTreeDuration, address _owner) Ownable(_owner) {
        semaphore = _semaphore;
        merkleTreeDuration = _merkleTreeDuration;
    }

    // ------------------------------------------------------------------
    // Administration (in production: the competent authority, e.g. MOHW)
    // ------------------------------------------------------------------

    function setVillage(uint32 village, uint32 township) external onlyOwner {
        if (townshipOf[village] == 0) villageList.push(village);
        townshipOf[village] = township;
        emit VillageSet(village, township);
    }

    function setIssuer(address account, Role role, uint32 region, bool active, string calldata name)
        external
        onlyOwner
    {
        Issuer storage i = issuers[account];
        if (i.role == Role.None && role != Role.None) issuerList.push(account);
        i.role = role;
        i.region = region;
        i.active = active;
        i.name = name;
        emit IssuerSet(account, role, region, active, name);
    }

    function createDisaster(string calldata name, string[] calldata tierNames)
        external
        onlyOwner
        returns (uint256 disasterId)
    {
        disasterId = ++disasterCount;
        Disaster storage d = disasters[disasterId];
        d.exists = true;
        d.name = name;
        d.createdAt = uint64(block.timestamp);
        d.tierCount = uint8(tierNames.length);
        emit DisasterCreated(disasterId, name, d.tierCount);

        for (uint8 t = 0; t < tierNames.length; t++) {
            uint256 groupId = semaphore.createGroup(address(this), merkleTreeDuration);
            tierGroup[disasterId][t] = groupId;
            tierName[disasterId][t] = tierNames[t];
            groupDisaster[groupId] = disasterId;
            groupTier[groupId] = t;
            isGroup[groupId] = true;
            emit TierGroupCreated(disasterId, t, groupId, tierNames[t]);
        }
    }

    // ------------------------------------------------------------------
    // Two-signature registration
    // ------------------------------------------------------------------

    /// @notice Either issuer of the village proposes; the other one must approve.
    /// @param receipt The household's own receipt address, read from its card or phone together with
    /// the commitment. Only registered receipt addresses can confirm or dispute payments.
    function proposeRegistration(
        uint256 disasterId,
        uint8 tier,
        uint32 village,
        uint256 commitment,
        bytes32 uniqueTag,
        address receipt
    ) external returns (uint256 id) {
        Disaster storage d = disasters[disasterId];
        if (!d.exists) revert UnknownDisaster();
        if (tier >= d.tierCount) revert UnknownTier();
        _requireJurisdiction(msg.sender, village);
        if (tagUsed[keccak256(abi.encode(disasterId, uniqueTag))]) revert DuplicateHousehold();
        if (commitmentUsed[keccak256(abi.encode(disasterId, commitment))]) revert DuplicateHousehold();
        if (receipt == address(0)) revert ZeroAddress();
        if (receiptUsed[keccak256(abi.encode(disasterId, receipt))]) revert DuplicateHousehold();

        id = registrations.length;
        registrations.push(
            Registration({
                disasterId: disasterId,
                commitment: commitment,
                uniqueTag: uniqueTag,
                proposer: msg.sender,
                decider: address(0),
                proposedAt: uint64(block.timestamp),
                decidedAt: 0,
                village: village,
                tier: tier,
                status: RequestStatus.Pending,
                receipt: receipt
            })
        );
        issuers[msg.sender].proposed++;
        emit RegistrationProposed(id, disasterId, village, tier, msg.sender);
    }

    function approveRegistration(uint256 id) external {
        Registration storage r = _decidable(id);
        bytes32 tagKey = keccak256(abi.encode(r.disasterId, r.uniqueTag));
        bytes32 commitmentKey = keccak256(abi.encode(r.disasterId, r.commitment));
        bytes32 receiptKey = keccak256(abi.encode(r.disasterId, r.receipt));
        if (tagUsed[tagKey] || commitmentUsed[commitmentKey] || receiptUsed[receiptKey]) revert DuplicateHousehold();
        tagUsed[tagKey] = true;
        commitmentUsed[commitmentKey] = true;
        receiptUsed[receiptKey] = true;
        commitmentVillage[commitmentKey] = r.village;
        commitmentReceipt[commitmentKey] = r.receipt;
        _receiptVillage[receiptKey] = r.village;

        r.status = RequestStatus.Approved;
        r.decider = msg.sender;
        r.decidedAt = uint64(block.timestamp);
        issuers[msg.sender].approved++;

        uint256 groupId = tierGroup[r.disasterId][r.tier];
        semaphore.addMember(groupId, r.commitment);
        _members[groupId].push(r.commitment);
        _memberIndexPlusOne[groupId][r.commitment] = _members[groupId].length;
        disasters[r.disasterId].verifiedHouseholds++;
        villageStats[r.disasterId][r.village].verified++;
        emit RegistrationDecided(id, true, msg.sender, bytes32(0));
    }

    function rejectRegistration(uint256 id, bytes32 reasonHash) external {
        Registration storage r = _decidable(id);
        r.status = RequestStatus.Rejected;
        r.decider = msg.sender;
        r.decidedAt = uint64(block.timestamp);
        issuers[msg.sender].rejected++;
        emit RegistrationDecided(id, false, msg.sender, reasonHash);
    }

    /// @notice Remove a wrongly registered household. Township office only.
    function revokeMember(
        uint256 disasterId,
        uint8 tier,
        uint32 village,
        uint256 commitment,
        uint256[] calldata merkleProofSiblings,
        bytes32 reasonHash
    ) external {
        _requireTownship(msg.sender, village);
        bytes32 key = keccak256(abi.encode(disasterId, commitment));
        if (commitmentVillage[key] != village) revert OutOfJurisdiction();
        delete commitmentVillage[key];
        delete _receiptVillage[keccak256(abi.encode(disasterId, commitmentReceipt[key]))];
        delete commitmentReceipt[key];
        uint256 groupId = tierGroup[disasterId][tier];
        semaphore.removeMember(groupId, commitment, merkleProofSiblings);
        _members[groupId][_memberIndexPlusOne[groupId][commitment] - 1] = 0;
        delete _memberIndexPlusOne[groupId][commitment];
        disasters[disasterId].verifiedHouseholds--;
        villageStats[disasterId][village].verified--;
        issuers[msg.sender].revoked++;
        emit MemberRevoked(disasterId, tier, village, msg.sender, reasonHash);
    }

    /// @notice Re-issue a lost or water-damaged card: swap the old commitment and receipt address for
    /// new ones. The old receipt address stops counting as a household immediately.
    function replaceMember(
        uint256 disasterId,
        uint8 tier,
        uint32 village,
        uint256 oldCommitment,
        uint256 newCommitment,
        address newReceipt,
        uint256[] calldata merkleProofSiblings,
        bytes32 reasonHash
    ) external {
        _requireTownship(msg.sender, village);
        bytes32 oldKey = keccak256(abi.encode(disasterId, oldCommitment));
        if (commitmentVillage[oldKey] != village) revert OutOfJurisdiction();
        bytes32 newKey = keccak256(abi.encode(disasterId, newCommitment));
        if (commitmentUsed[newKey]) revert DuplicateHousehold();
        if (newReceipt == address(0)) revert ZeroAddress();
        bytes32 newReceiptKey = keccak256(abi.encode(disasterId, newReceipt));
        if (receiptUsed[newReceiptKey]) revert DuplicateHousehold();
        commitmentUsed[newKey] = true;
        receiptUsed[newReceiptKey] = true;
        delete _receiptVillage[keccak256(abi.encode(disasterId, commitmentReceipt[oldKey]))];
        delete commitmentReceipt[oldKey];
        delete commitmentVillage[oldKey];
        commitmentVillage[newKey] = village;
        commitmentReceipt[newKey] = newReceipt;
        _receiptVillage[newReceiptKey] = village;
        uint256 groupId = tierGroup[disasterId][tier];
        semaphore.updateMember(groupId, oldCommitment, newCommitment, merkleProofSiblings);
        uint256 slot = _memberIndexPlusOne[groupId][oldCommitment];
        _members[groupId][slot - 1] = newCommitment;
        _memberIndexPlusOne[groupId][newCommitment] = slot;
        delete _memberIndexPlusOne[groupId][oldCommitment];
        emit MemberReplaced(disasterId, tier, msg.sender, reasonHash);
    }

    // ------------------------------------------------------------------
    // Appeals and coverage: making exclusion visible
    // ------------------------------------------------------------------

    /// @notice Open to anyone (usually relayed for the household, a social worker or the chief).
    function fileAppeal(uint256 disasterId, uint32 village, bytes32 evidenceHash) external returns (uint256 id) {
        if (!disasters[disasterId].exists) revert UnknownDisaster();
        if (townshipOf[village] == 0) revert UnknownVillage();
        id = appeals.length;
        appeals.push(
            Appeal({
                disasterId: disasterId,
                evidenceHash: evidenceHash,
                resolutionHash: bytes32(0),
                resolver: address(0),
                filedAt: uint64(block.timestamp),
                resolvedAt: 0,
                village: village,
                status: AppealStatus.Pending
            })
        );
        VillageStats storage s = villageStats[disasterId][village];
        s.appealsFiled++;
        s.appealsPending++;
        emit AppealFiled(id, disasterId, village, evidenceHash);
    }

    function resolveAppeal(uint256 id, bool accepted, bytes32 resolutionHash) external {
        Appeal storage a = appeals[id];
        if (a.status != AppealStatus.Pending) revert NotPending();
        _requireTownship(msg.sender, a.village);
        a.status = accepted ? AppealStatus.Accepted : AppealStatus.Rejected;
        a.resolutionHash = resolutionHash;
        a.resolver = msg.sender;
        a.resolvedAt = uint64(block.timestamp);

        VillageStats storage s = villageStats[a.disasterId][a.village];
        s.appealsPending--;
        if (accepted) s.appealsAccepted++;
        else s.appealsRejected++;
        s.resolutionSecondsTotal += a.resolvedAt - a.filedAt;
        issuers[msg.sender].appealsResolved++;
        emit AppealResolved(id, accepted, msg.sender, resolutionHash);
    }

    /// @notice Designate (or remove) someone who may sign "received" / "not received" for households of
    /// one village in one disaster, e.g. a social worker for elders without a phone. Township office only.
    /// A household's own signature always overrides a proxy's.
    function setProxy(uint256 disasterId, uint32 village, address proxy, bool active) external {
        if (!disasters[disasterId].exists) revert UnknownDisaster();
        _requireTownship(msg.sender, village);
        if (proxy == address(0)) revert ZeroAddress();
        _proxy[keccak256(abi.encode(disasterId, village, proxy))] = active;
        emit ProxySet(disasterId, village, proxy, active, msg.sender);
    }

    /// @notice Anonymous "verified, still waiting for aid" report, relayed for the household. The proof
    /// shows membership in a tier group of this disaster; its message is the village the household
    /// declares (not checked: groups are per disaster and tier, never per village, to keep anonymity
    /// sets large); its nullifier allows one report per household per period.
    function reportWaiting(uint256 disasterId, uint256 groupId, ISemaphore.SemaphoreProof calldata proof) external {
        if (!disasters[disasterId].exists) revert UnknownDisaster();
        if (!isGroup[groupId] || groupDisaster[groupId] != disasterId) revert InvalidProof();
        uint64 period = currentPeriod(disasterId);
        if (proof.scope != waitingScope(disasterId, period)) revert WrongScope();
        if (proof.message > type(uint32).max || townshipOf[uint32(proof.message)] == 0) revert UnknownVillage();
        bytes32 key = keccak256(abi.encode(disasterId, period, proof.nullifier));
        if (waitingNullifierUsed[key]) revert AlreadyReported();
        if (!semaphore.verifyProof(groupId, proof)) revert InvalidProof();
        waitingNullifierUsed[key] = true;
        uint32 village = uint32(proof.message);
        waitingReports[disasterId][period][village]++;
        emit WaitingReported(disasterId, period, village);
    }

    function currentPeriod(uint256 disasterId) public view returns (uint64) {
        return uint64((block.timestamp - disasters[disasterId].createdAt) / WAITING_PERIOD);
    }

    /// @notice Semaphore scope for the waiting reports of one disaster in one period.
    function waitingScope(uint256 disasterId, uint64 period) public view returns (uint256) {
        return uint256(keccak256(abi.encode(address(this), "waiting", disasterId, period))) >> 8;
    }

    /// @notice The township office holds the roster legally; it publishes only the count of verified
    /// households in a village that have not yet received any programme.
    function reportCoverage(uint256 disasterId, uint32 village, uint32 unserved) external {
        _requireTownship(msg.sender, village);
        VillageStats storage s = villageStats[disasterId][village];
        s.unserved = unserved;
        s.coverageAsOf = uint64(block.timestamp);
        emit CoverageReported(disasterId, village, s.verified, unserved, msg.sender);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    function verifiedHouseholds(uint256 disasterId) external view returns (uint256) {
        return disasters[disasterId].verifiedHouseholds;
    }

    /// @notice Village of an active registered household's receipt address; 0 if not registered.
    function villageOfReceipt(uint256 disasterId, address receipt) external view returns (uint32) {
        return _receiptVillage[keccak256(abi.encode(disasterId, receipt))];
    }

    function isProxy(uint256 disasterId, uint32 village, address proxy) external view returns (bool) {
        return _proxy[keccak256(abi.encode(disasterId, village, proxy))];
    }

    function issuerCount() external view returns (uint256) {
        return issuerList.length;
    }

    function villageCount() external view returns (uint256) {
        return villageList.length;
    }

    /// @notice All leaves of a group in tree order (0 = revoked). Enough to rebuild it off-chain.
    function groupMembers(uint256 groupId) external view returns (uint256[] memory) {
        return _members[groupId];
    }

    function registrationCount() external view returns (uint256) {
        return registrations.length;
    }

    function appealCount() external view returns (uint256) {
        return appeals.length;
    }

    /// @notice True if the proof shows membership in a tier group of `disasterId`. Does not consume
    /// the nullifier; callers track nullifiers per their own scope.
    function verifyMembership(uint256 disasterId, uint256 groupId, ISemaphore.SemaphoreProof calldata proof)
        external
        view
        returns (bool)
    {
        if (!isGroup[groupId] || groupDisaster[groupId] != disasterId) return false;
        return semaphore.verifyProof(groupId, proof);
    }

    // ------------------------------------------------------------------
    // Internal
    // ------------------------------------------------------------------

    function _decidable(uint256 id) internal view returns (Registration storage r) {
        r = registrations[id];
        if (r.status != RequestStatus.Pending) revert NotPending();
        _requireJurisdiction(msg.sender, r.village);
        if (issuers[msg.sender].role == issuers[r.proposer].role) revert SameRoleCannotApprove();
    }

    function _requireJurisdiction(address account, uint32 village) internal view {
        Issuer storage i = issuers[account];
        if (!i.active || i.role == Role.None) revert NotIssuer();
        uint32 township = townshipOf[village];
        if (township == 0) revert UnknownVillage();
        if (i.role == Role.VillageChief && i.region != village) revert OutOfJurisdiction();
        if (i.role == Role.TownshipOffice && i.region != township) revert OutOfJurisdiction();
    }

    function _requireTownship(address account, uint32 village) internal view {
        Issuer storage i = issuers[account];
        if (!i.active || i.role != Role.TownshipOffice) revert NotIssuer();
        if (townshipOf[village] == 0) revert UnknownVillage();
        if (i.region != townshipOf[village]) revert OutOfJurisdiction();
    }
}
