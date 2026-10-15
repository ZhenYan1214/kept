# Kept 專案交接文件（HANDOFF）

> **給接手的 AI／自己：** 先完整讀完這份文件再動手。這份文件已 commit 到 repo；`.env.testnet`（測試網助記詞）和 `contest/` 底下的研究資料**沒有**進 repo，要手動帶到新電腦。
> 最後更新：2026-10-15。使用者以繁體中文溝通；產品、程式、提交內容一律英文。

---

## 0. 一分鐘現況

| 項目 | 狀態 |
|---|---|
| 比賽 | DoraHacks「Web3 for Social Good Hackathon 2026」，**Tech Track，個人參賽**，已註冊 |
| **初賽截止** | **2026/10/25 00:00（未標時區，目標 10/24 中午前送出）** |
| 題目 | **Kept**：讓災難善款的兩個承諾都可驗證：對捐款人承諾錢怎麼用，對災民承諾不漏掉任何人 |
| 程式碼 | https://github.com/ZhenYan1214/kept （`main` 分支） |
| 合約 | 6 份，41 個單元測試全過；端對端腳本用**真實 Semaphore ZK 證明**跑通 |
| 前端 | Next.js，9 個頁面，完整 Demo 流程已在瀏覽器實測跑通，`next build` 成功 |
| **卡住的事** | ① 測試網錢包還沒有 ETH ② Vercel 還沒登入 |
| 接下來 | 部署 Base Sepolia → 部署 Vercel → 英文提案 → Demo 影片 → 送出 |

---

## 1. 比賽資訊

- 網址：https://dorahacks.io/hackathon/web3-social-good-2026/detail （Tracks 頁：`/tracks`）
- 主辦：新加坡管理大學 SMU 資訊學院（SCIS）＋ GSR Foundation ＋ 西班牙馬拉加大學（UMA）。獎金 USD 20,000。
- 時程：
  - 10/25 初賽截止（線上提交）
  - 10/26 公布入圍
  - 10/27–11/25 修改期（有導師）
  - 11/26 決賽與頒獎（SMU 現場，**Tech Track 可線上報告**；新加坡時間＝台灣時間）
- 評分：社會影響力與問題相關性 30%｜解法品質 25%｜創新與 Web3 的有意義運用 20%｜可行性與永續性 15%｜簡報與 Demo 10%
- Tech Track：要有原型或 demo，說清楚問題、使用者／受益者、Web3 的角色。可用 EVM、Solana、Aptos、Sui 等鏈。
- 決賽日上午有 GSR–SMU–UMA 合作簽約、《2026 Web3 for Social Good 白皮書》發表、有公部門參與的座談 → 評審偏好**能落地的提案**。
- 頁面寫「Submit Build」，表單欄位不確定（使用者說「就是那些東西，提前準備好」）：通常是名稱、簡介、詳細描述、GitHub、Demo 影片、網站連結、團隊。

### 評審線索（重要）
- **UMA 預選賽（2026/9/24–25，GSR Foundation 共同資助）題目「Blockchain for Good · Proof of Aid」**：追蹤 NGO 捐款從需求到交付，並保護受助者個資。冠軍隊（UMA 資訊系 Javier Martín Jurado、Jorge Varea Durán、Pablo Castellano Jiménez）**直接進新加坡決賽** → 我們會被拿來直接比較。
- GSR Foundation 關注：Blockchain for Good、**數位公共財（DPG）**、教育基礎建設、網路接取、新興科技的負責任應用。也是 Mercy Corps／Aleo 隱私穩定幣援助試點的夥伴。
- SMU 有 Aptos 資助的區塊鏈講座教授（Zhu Feida），關注 Web3、AI、資料治理、合規科技。
- DoraHacks 母公司 Dora Factory 專做 MACI、quadratic funding。

---

## 2. 使用者偏好與決策歷程（務必遵守）

1. **題目要從真實事件出發，不要理想化**；要「真的需要」、有明確動機，不是為了做而做。
2. **要站得住腳、該有的都要有**；所有事實都要有來源，宣稱要保守。
3. 個人參賽，選 Tech Track；使用者說「時間一定夠」，技術沒問題。
4. 曾問「台灣小事件有沒有意義」→ 決定：**國際知名案例開場（海地），台灣案例深挖**。
5. 開工前要求我「不斷反思找出被忽略的問題」→ 產出反思清單，修正了產品定位（見 §5）。
6. Commit 和 push 只在使用者要求時做。

---

## 3. 問題與動機

### 一句話動機
**花蓮人不是不想捐，是不敢再捐。信任崩壞的代價，由下一次的災民承擔。**

### 反覆出現的循環（國際皆然）
先募款、後規劃 → 保管方掌握所有紀錄 → 災民沒有發言權 → 結餘與延宕 → 信任崩解，捐款轉向別處

### 國際錨點（已查核）
- **美國紅十字會・海地 2010**：募得 4.88 億美元，全海地只蓋 6 棟永久住宅（ProPublica/NPR 2015-06-03）；參議員 Grassley 2016 年報告指出約 25%（約 1.25 億美元）用於內部成本。執行長內部信曾問「剩下的錢怎麼花」。
- **日本紅十字會・東北 2011**：持有約 1,740 億日圓，超過 1,000 億沒有分配計畫；會長說受領者「無法確認」（Reuters 2011-05-11）。
- **瓦倫西亞 DANA 洪災 2024**：自治區審計機關認定善款的**登錄方式**「不適當」；約 2,214 萬歐元到 2024 年底都沒列入預算，多數在 2025 年第四季才分配（El Español 2026-01-06）。→ 給 UMA 評審
- **新加坡 NKF 2005**：衛生部長國會聲明（**2005-07-21**）；之後成立慈善委員辦公室（2006-07-01）、《慈善法》修正（2007）、《治理守則》（2007-11）。→ 給 SMU 評審
- **中國紅十字會・郭美美 2011**：捐款下降**近六成**（DW 2012-10-30）。
- **土耳其 2023**：不信任政府的民眾轉捐 NGO Ahbap（Reuters 2023-02-24）。
- 學術研究不一致：醜聞不一定讓捐款總額下降，可能只是轉捐。→ 要說「信任決定錢流向哪裡」。

### 台灣證據（已查核）
| 事件 | 事實 | 來源 |
|---|---|---|
| 2014 高雄氣爆 | 善款 45.66 億；監察院糾正 59 項計畫都未敘明符合捐款管理要點第 4 點哪一款用途（含赴泰觀光推廣、值班椅 19.6 萬） | 監察院 2020-06-16 |
| 2018 花蓮 0206 | 善款約 27 億（縣府＋衛福部合計約 27.8 億）；60 案到 2026-03 仍有 12 案未結；**2026-07-29 檢方搜索縣府社會處，偵查中** | 公視 https://news.pts.org.tw/article/819992 |
| 2024 花蓮 0403 | 縣府專戶約 7.9 億，一年後仍剩約 4.2 億；委員會只開 3 次、沒有受災戶和民代 | 公視 2025-03-31 https://news.pts.org.tw/article/744652 |
| 2024 0403 | 賑災基金會撥花蓮 4.53 億，不到 0206 時 27 億的五分之一；議員楊華美：民眾寧願捐中央；議員胡仁順主張自治條例，近 300 人連署 | 公視 2024-05-17 https://news.pts.org.tw/article/695533 |
| 2025 光復堰塞湖（9/23） | 19 死 5 失蹤；賑災基金會募 13.98 億、逾 31 萬筆；縣長募款貼文遭質疑後已查無；南富、大進、大全三村被排除在縣府慰問金外而陳抗（10/6） | 中央社 https://www.cna.com.tw/news/aloc/202510060164.aspx |
| 2025 光復 | **基金會已支出（含預撥）12.09 億，已核銷 4,915 萬（約 4%）**，至少約 11.1 億預撥衛福部，下游逐戶發放不公開（截至 2026-09-25） | https://www.tf4dr.org/fundraising_plans/156/credits |
| 2025 光復 | 受災戶數各機關不一：撤離 1,837／淤泥 1,606／領慰助 2,582（統計對象不同）；CCRA 在 12/5–6 發放 2,364 戶（約災後 10 週） | 研究筆記 |
| 2025 光復 | 「鏟子英雄」媒合網站為讓長輩好用拿掉登入，導致電話與 email 外洩、資料可被竄改，下架 | 東森 2025-10-01 |
| 2025 | Binance Charity 與臺灣區塊鏈愛好者協會 117,210 USDT → 經在地 VASP 換成 3,571,631 元捐入賑災基金會 | 經濟日報 2025-10-21 |

### 制度缺口（已查核）
- 《公益勸募條例》第 18–20 條（使用計畫、結餘 3 年、成果上網）主詞是「勸募團體」，**不適用政府專戶**；政府專戶只受第 6 條最低揭露（研究員對條文的解讀）。
- 條例自 2020-01-15 後未再修正；陳菁徽版第 6 條修正案 2024-03 交付審查後無進度；花蓮自治條例只有倡議，查不到草案；沒有縣市以自治條例規範災害捐款。
- 2025 堰塞湖特別條例：**公帑**每月公開進度，**民間善款**沒有任何條文。
- 賑災基金會章程：董事全由行政院選聘，無受災者名額。花蓮作業要點第 3 點：受災民眾最多 5 人**列席**、經主席同意才能發言，**無表決權**；2026-03 新一屆委員無受災戶代表。
- 公開資料格式：基金會報表是 PNG 圖片、捐款名單 RAR；縣府收入 JPG、支出 PDF（停在 2025-12-26，且把「匡列」當「支出」）；衛福部公益勸募系統**不含政府專戶**。
- 台灣數位憑證皮夾（TW DIW）2025-12-17 試營運，**沒有任何災害相關憑證場景**。
- 法務部 102.01.14 函釋：政府提供合格名冊給慈善團體「僅供發放之用」可能合乎個資法第 16 條（例子是**敬老金**，需個案認定）。
- 日本：罹災証明書＋被災者台帳（災害対策基本法 90-2～90-4）；**2025 年修法**讓登錄的「被災者援護協力団体」在攸關生命時可不經同意取得資料。
- 《虛擬資產服務法》2026-06-30 三讀，穩定幣發行需許可，子法完成後最快 2027 Q1 施行。

### 措辭規範（對外一律遵守）
| ✅ 可以說 | ❌ 不可以說 |
|---|---|
| 監察院糾正 0206 的感恩餐會、採購與預算流用（用的是**公務預算**） | 監察院糾正挪用善款 |
| 2026-07-29 檢方搜索，仍在偵查中 | 花蓮縣府貪污 |
| 已撥款中已核銷約 4%，下游大眾無法驗證（預撥後核銷是正常緊急程序） | 只有 4% 的錢送到災民手上 |
| 捐款下降近六成 | 下降 57.39% |
| 我們沒有找到同時做到 X 和 Y 的部署 | 全球第一 |
| 4.2 億（縣府專戶）與 4.53 億（基金會撥款）分開講 | 混在一起比較 |
| 匿名化描述受災者 | 使用新聞裡的真實姓名 |

---

## 4. 現有方案與差異

| 方案 | 做到的 | 沒做到的 |
|---|---|---|
| 法定公開徵信、基金會每月逐筆撥款 | 第一手撥款 | 下游送達、機器可讀、跨帳戶、災民參與 |
| **guangfu.tw**（究心公益科技／GeoThings，基金會撥 200 萬） | 光復重建資訊整合、捐款**來源**總額 14 億+、AI 週報 | 款項承諾約束、逐手交付驗證、資格與申訴 → **互補，Kept 可當它的資料層** |
| **西班牙紅十字會 RedChain**（2026-02） | ERC-20 援助點數＋ZK 資格憑證（Billions/iden3），鏈上只放雜湊 | 用途承諾治理、去重、覆蓋率 → **UMA 評審一定知道，ZK 資格不能當賣點** |
| WFP Building Blocks | 跨機構去重（烏克蘭 18 個組織避免約 3,500 萬美元重複） | 捐款人承諾、災民參與 |
| ETHGlobal 的 OpenRelief、SewaChain | 跨組織 nullifier 去重、gap 儀表板 | 黑客松等級；SewaChain 的 Aadhaar 雜湊可反推 |
| 論文 "Not Yet Another Digital ID"（EPFL×ICRC，IEEE S&P 2023） | 每戶每輪一次、智慧卡版 | 要引用，不能宣稱原創 |

**我們找到的空白：**
1. 由程式碼強制的善款承諾：用途上限、結餘規則、冷靜期，**加上災民的否決權**
2. 跨保管方的監管鏈：匡列 → 撥付 → 核銷（Merkle root）→ 災民簽收
3. 被排除者的公開問責：各村申訴統計、簽發者核准與駁回統計

**和 UMA 冠軍隊的差異：** 他們證明援助送到了；Kept 讓**保管方的承諾**和**被漏掉的人**都可驗證，並讓災民有一票。

---

## 5. 解法：Kept

> **核心洞見：同一張受災證明，讓你領得到錢，也讓你對錢怎麼用有一票。**

### 三個核心機制
- **M1 承諾**：建立基金時就寫死用途清單（章程外的用途永遠不能撥款）、各用途上限（佔募得總額比例）、結餘規則。改上限或延長期限要走公開冷靜期，災民可以否決；緊急情況走較高門檻、立即生效，事後由災民檢討。**到期不強迫花完**（不懲罰審慎），延長要災民同意。
- **M2 監管鏈**：每一筆都是「轉出方記錄＋接收方簽收」，可以往下轉撥；發放時上傳名冊的 Merkle root，大眾看得到總額，每戶能證明自己有被算進去，並用**收據金鑰簽章**表示「已收到」或「被記成已領、實際沒拿到」。保管方無法偽造。
- **M3 災民之聲**：通過認證的災民可以匿名、一戶一票對變更投票（Semaphore）；任何人（包括沒被登記的人）都能申訴，各村的申訴件數與處理天數公開。

### 資格層（借用，不宣稱原創）
- 村長＋公所**雙重簽核**才加入 Semaphore 群組；群組以「整場災害＋受災等級」為單位（不以村分，避免匿名集合太小）
- 盲化唯一標籤：主管機關用密鑰對身分證字號做 HMAC，防止同一人跨村重複登記
- **每個方案使用不同的 nullifier**：防重複，且不同方案之間無法串連
- 兩種發放模式：**主動發放**（政府照名冊直接撥款，災民不用做事）、**出示證明**（災民到 NGO 出示 QR）

### 設計原則
區塊鏈縮到最小但不可或缺｜個資零上鏈（只放承諾值、雜湊、Merkle root）｜不讓災民多做事（紙本卡、代理簽收、不付 gas）｜不懲罰審慎｜讓人的判斷可追責，而不是取代人｜k-匿名（少於 5 戶顯示「<5」）｜尊重原住民族（光復受災最重的是阿美族馬太鞍、太巴塱部落；2026 年發生長輩在沒有充分說明下簽土地同意書的爭議）｜數位公共財（DPG）

### 為什麼用 Web3（評審必問）
- **被監督的人不能管帳本**；可信的承諾要獨立於保管方，也不受政黨輪替影響
- 多個互不隸屬的保管方需要共享狀態，卻沒有適合當中心的營運者
- 災民的票需要匿名（小社區有報復與人情壓力）
- 法律靠事後查核（新加坡 NKF 後走立法），程式碼在事前強制執行；台灣修法停滯，Kept 可以是自治條例的技術實作
- 刻意不上鏈：姓名、身分證、銀行帳號、名冊；資格仍由村長和公所判斷

### 落地路徑
1. **第一階段**（現行法規下即可）：錢仍在銀行，鏈上記錄承諾、決議、撥付憑證雜湊、核銷 Merkle root、簽收。保管方自願加入，換取「Kept 認證基金」的信任標章。
2. **第二階段**：以自治條例或修法要求採用（對應 0403 後的連署）。
3. **第三階段**：合規的台幣穩定幣上路後，錢直接進合約，由程式碼強制執行。
- 最可能的試點：賑災基金會（已經每月公開逐筆撥款，曾資助 guangfu.tw）
- 定位：保管方**贏回信任**的工具（0403 的善款不到 0206 的五分之一），不是抓壞人的工具

### 影響力指標（附現況基準）
可驗證到哪一手（現況：第一手）｜可驗證已送達的比例（現況：無法得知）｜災民表決權（現況：0）｜申訴統計公開（現況：無）｜資料機器可讀（現況：PNG/JPG/PDF/RAR）｜NGO 取得資格驗證時間（現況：約 10 週 → 當場）

---

## 6. 技術架構

### Repo 結構
```
kept/
├── contracts/            Foundry（solc 0.8.28, via_ir, cancun）
│   ├── src/              6 份合約 + MockTWD + interfaces/IKept.sol
│   ├── test/             41 個測試（MockSemaphore）
│   ├── script/Deploy.s.sol
│   ├── scripts/          ensure-poseidon.mjs, e2e.mjs（真實 ZK 證明）, deploy-testnet.mjs
│   └── deployments/      <chainId>.json（31337 被 gitignore）
├── web/                  Next.js 15.5 + React 19 + Tailwind 4 + viem
│   ├── scripts/sync-contracts.mjs   產生 src/generated/contracts.ts（ABI + 部署地址）
│   └── src/
│       ├── app/          頁面 + api/{tx,seed,roles,sim/vote,dev/time}
│       ├── components/   snapshot（狀態 context + 輪詢）, panels, ui, nav
│       ├── lib/          config, chain, snapshot, semaphore, household, inbox, roster, scopes, receipt, scenario
│       └── server/       roles.ts（Demo 角色金鑰與白名單）, seed.ts
├── README.md             公開說明（英文）
└── HANDOFF.md            本文件
```

### 合約
| 合約 | 重點 |
|---|---|
| `KeptFactory` | 用 OZ Clones 從同一份範本建立基金；`isFund` 是其他模組唯一承認的來源；`setModules` 只能呼叫一次 |
| `ReliefFund` | `InitParams`（name, surplusRule, custodian, token, disasterId, deadline, threshold, emergencyThreshold, timelock, quorumBps, committee[], purposeNames[], purposeCaps[]）。`donate`／`proposeAllocation`（`purposeId >= 用途數` → `PurposeNotInCharter`；Demo 用 255 代表「一般公共工程」）／`proposeCapChange`（可選 emergency）／`proposeExtension`／`approve`／`execute`（冷靜期後；`voice.isVetoed` → Vetoed）／`cancel`。撥款執行時把 token 轉給收款方並呼叫 `ledger.recordAllocation` |
| `CustodyLedger` | Hop{parent, fund, from, to, amount, forwarded, reconciled, ackAt, estHouseholds, reconciledHouseholds, confirmed, proxyConfirmed, disputed, programDelivered, purposeId}。`acknowledge`／`forward`／`reconcile(root, amount, households)`／`confirmLine`（EIP-712 `Receipt(hopId,batchIndex,receipt,amount,received)`，簽章者必須是收據地址或已登記的代理人）／`verifyInclusion`。葉子＝OZ StandardMerkleTree (address,uint256) |
| `EligibilityRegistry` | 角色：VillageChief(1)/TownshipOffice(2)；`createDisaster` 為每個等級建立 Semaphore 群組（admin＝本合約）；`proposeRegistration`→`approveRegistration`（不同角色）／`reject`／`revokeMember`／`replaceMember`（遺失卡片）；`fileAppeal`（任何人）／`resolveAppeal`（公所）／`reportCoverage`；`villageStats` |
| `VoiceModule` | 只有工廠產生的基金能 `openVote`；`castVote(voteKey, groupId, proof)`：scope＝`uint256(voteKey)>>8`，message 0/1，自己記錄 nullifier（避免被搶先送出 Semaphore 證明而失敗）；否決＝反對>贊成且投票率≥quorum |
| `AidPrograms` | NGO `createProgram(hopId, disasterId, tierMask, amountPerHousehold, name)`；`claim` 只能由 NGO 自己的終端機送出；scope＝`keccak(address(this), programId)>>8`；有連結 hop 時記為當面交付 |
| `MockTWD` | 0 位小數、公開水龍頭，代表未來的合規台幣穩定幣（**僅測試網**） |

- Semaphore v4.14.3（`@semaphore-protocol/contracts`）。PoseidonT3 用**確定性地址** `0x3333333C0A88F9BE4fd23ed0536F9B6c427e3B93`（foundry.toml `libraries`）。Base Sepolia 上官方 Semaphore v4：`0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`（已確認可用，groupCounter=362），Poseidon 和 Multicall3 也都有。
- 單元測試用 `test/mocks/MockSemaphore.sol`（`points[0]==1` 視為有效）；真實證明由 `npm run e2e` 驗證（12 項通過）。

### 前端與 Demo 伺服器
- 鏈上狀態由 `lib/snapshot.ts` 讀取（readContract＋分段 getLogs），`SnapshotProvider` 每 4 秒（本機）／10 秒（測試網）輪詢
- `/api/tx`：Demo 模式下由伺服器以角色身分簽章，**每個角色有白名單**（`server/roles.ts` 的 `ALLOWED`），每個角色有交易鎖避免 nonce 衝突，gas 不足時自動補
- 角色由同一組助記詞的 HD index 衍生（`lib/scenario.ts` 的 `ROLES`）：authority 0、office 1、chief0–4 = 2,10,11,12,13、c1–c3 = 3,4,5、ministry 6、ngo 7、donor 8、custodian 9、county 14、socialWorker 15、relayer 16
- `/api/seed`：建立模擬情境（5 村、雙簽 20 戶、10 筆捐款共 NT$960 萬、4 件申訴、3 筆撥款、1 筆轉撥、1 批名冊、8 筆簽收、1 筆異議）。本機約 17 秒
- `/api/sim/vote`：用模擬受災戶身分在伺服器端產生**真實證明**投票（Demo 用）
- `/api/dev/time`：只限本機鏈，快轉時間
- 受災戶的 Semaphore 身分和收據金鑰存在瀏覽器 localStorage（`kept.household`）；裝置之間的「掃 QR」用 localStorage 收件匣模擬（`kept.inbox`）；公所名冊在 `kept.township-roster`
- 頁面：`/` 儀表板、`/why`、`/donate`、`/household`、`/issuer`、`/committee`、`/custody`、`/ngo`、`/setup`

### 踩過的坑（別再踩）
- viem 的 `waitForTransactionReceipt` 在自動出塊的 anvil 上會卡住，因為它在等下一個區塊 → 改用 `server/roles.ts` 的 `waitReceipt` 直接輪詢收據
- Next 打包 snarkjs 會讓伺服器端產生證明時卡住 → `next.config.ts` 的 `serverExternalPackages`
- `@zk-kit/lean-imt.sol/` 這條 remapping 會被 Foundry 弄壞 → 刪掉，改用自動的 `@zk-kit/`
- PoseidonT3 在 via_ir 下超過合約大小上限 → 連結到確定性地址，部署前執行 `ensure-poseidon.mjs`
- Foundry 測試裡，`vm.prank`／`expectRevert` 會被參數裡的外部呼叫吃掉 → 參數要先算好存進變數
- 用背景 Bash 啟動的 anvil 會在 AI 回覆結束時被關掉 → 改用 `.claude/launch.json` 的預覽伺服器，並加上 `--state` 存檔

---

## 7. 新電腦如何接手

```bash
git clone --recursive https://github.com/ZhenYan1214/kept.git   # forge-std 是 submodule
cd kept/contracts && npm install && forge test
anvil --state .anvil-state.json --state-interval 10              # 另開終端機
npm run deploy:local
cd ../web && npm install && npm run dev                          # http://localhost:3000 → Setup → Set up scenario
```

- 需要：Node 20+（原本用 24）、Foundry（原本用 forge 1.8.5）
- 如果要沿用測試網錢包，把 `.env.testnet` 放回 `kept/`（它沒有進 repo）
- 換新的本機鏈之後，瀏覽器先到 Setup → **Reset local demo data**
- 如果在 Claude Code 桌面版，可以在專案根目錄建 `.claude/launch.json`，加入 `anvil` 和 `kept-web` 兩個設定

---

## 8. 待辦（依優先順序）

### A. 部署（卡住中）
1. **測試網錢包**：authority／deployer `0xe79cC12f60F7FFEB515F3e273604c8f176A162A2`，助記詞在 `kept/.env.testnet`（gitignore）。需要約 0.05 Base Sepolia ETH（Coinbase CDP faucet）。
   - 如果 `.env.testnet` 沒帶到新電腦且還沒領幣：重新產生即可（用 viem `generateMnemonic`，格式參考下方）。
   - `.env.testnet` 格式：`DEMO_MNEMONIC="..."`、`NEXT_PUBLIC_CHAIN_ID=84532`、`NEXT_PUBLIC_RPC_URL=https://sepolia.base.org`、`SEMAPHORE_ADDRESS=0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`、`DEMO_TIMELOCK_SECONDS=300`
2. `cd contracts && npm run deploy:base-sepolia` → 產生 `deployments/84532.json`（要 commit）
3. `cd web && npm run sync && npm run dev:testnet`（port 3001）→ `curl -X POST localhost:3001/api/seed`（測試網上約數分鐘）
4. Vercel：`npx vercel login`（使用者自己登入）；Root Directory 設 `web`；環境變數：`NEXT_PUBLIC_CHAIN_ID=84532`、`NEXT_PUBLIC_RPC_URL`、`DEMO_MNEMONIC`（加密）、`DEMO_TIMELOCK_SECONDS=300`。或直接連 GitHub repo 自動部署。
   - 注意：Vercel 上沒有 `contracts/out`，`sync-contracts.mjs` 會略過，所以 **`src/generated/contracts.ts` 必須包含 84532 的部署並 commit**
   - 公開 RPC 可能有速率限制；不夠的話改用 Alchemy／QuickNode 的 Base Sepolia RPC
   - 風險（寫進 README）：Demo API 公開，任何人都能操作白名單內的函式；只是測試網，最壞情況是測試幣耗光
5. 用公開網址把 Demo 從頭跑一次（測試網冷靜期 5 分鐘）

### B. 提交內容（全英文）
- 專案名稱與一句話：*Kept — disaster-relief promises you can verify*
- 問題（國際錨點 → 台灣循環 → 缺口）、使用者與受益者、解法（三機制）、為什麼用 Web3、和現有方案的差異、影響力指標、落地路徑與可持續性、限制、路線圖（10/27–11/25 修改期要做什麼）
- 連結：GitHub、網站、Demo 影片
- README 已有大部分素材；`/why` 頁面已有附來源的問題陳述

### C. Demo 影片（3 分鐘以內，英文旁白或字幕）
建議流程：海地開場（15 秒）→ 台灣循環（30 秒）→ 儀表板總覽 → 受災戶建立憑證 → 雙重簽核 → NGO 掃碼（ZK）、重複申領被擋 → 章程外撥款被拒 → 冷靜期與匿名投票 → 否決 → 名冊 Merkle root 與簽收 → 收尾（落地路徑、DPG）

### D. 修改期（入圍後）路線圖
- 每個方案用不同的收據金鑰（目前同一戶的簽收可以被串連；只需要改鏈下規則）
- 災民匿名推選委員代表
- 和數位憑證皮夾的 VC 格式對接（OID4VC／SD-JWT）；紙本 QR 卡列印
- 依據 IATI／Open Contracting 匯出開放資料；可供 guangfu.tw 使用
- 測試網時間戳顯示、更多無障礙設計與中文介面
- 訪談 NGO 或基金會，驗證需求（評審會加分）

---

## 9. 其他背景資料（只在舊電腦上，沒有進 repo）
`C:\Users\User\Desktop\contest\` 底下：
- `專案定義書.md`（v0.2，本文件 §3–§5 的完整版）、`反思與風險清單.md`、`產品架構規劃.md`（v0.1，已作廢）
- `reports/Web3 社會公益現況研究.md`（Web3 公益全景研究，含 14 項機會缺口）
- `research_notes/Web3 社會公益現況研究/`（8 份：人道援助、普惠金融、氣候、公共財、身分／教育／醫療、AI＋論文、鏈生態、主辦方與亞洲脈絡）
- `research_notes/台灣災難捐款真實案例/`（2025 光復、歷年爭議與法規、救助流程與現有工具、國際案例、事實查核、法規現況與缺口確認、現有方案比較）

如果要帶走，整個 `contest/` 資料夾複製過去即可。
