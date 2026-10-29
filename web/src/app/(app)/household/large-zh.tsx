"use client";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Address } from "viem";
import { useSnapshot } from "@/components/snapshot";
import { useToast } from "@/components/toast";
import { cx, ntd } from "@/components/ui";
import { Icon, KeptMark } from "@/components/icons";
import { cardReceipt, newCard, registrationPayload, type HouseholdCard } from "@/lib/household";
import { postInbox, useInbox } from "@/lib/inbox";
import { answerLine, signAuditVisit, useHouseholdTier, useMyLines, useStillWaiting, type MyLine } from "@/lib/household-actions";
import { VILLAGES, type RoleName } from "@/lib/scenario";

/**
 * The household screen as an older resident in Guangfu would use it: Traditional Chinese, large type,
 * one question at a time, big buttons. Same credential, same contracts, same signatures as the standard screen.
 */

const TIERS_ZH = ["全倒", "半倒", "淹水"];
const ROLE_ZH: Partial<Record<RoleName, string>> = {
  ministry: "衛生福利部",
  county: "花蓮縣政府",
  ngo: "合作社福團體",
  custodian: "賑災基金會",
  office: "光復鄉公所",
};

const ERRORS_ZH: Record<string, string> = {
  AlreadyRecorded: "這筆款項已經回報過了。",
  AlreadyVoted: "本週已經回報過了。",
  BadSignature: "簽章不正確，只有您本人（或登記的社工）可以回答。",
};

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("rounded-2xl border border-line bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-7", className)}>{children}</section>;
}

/** A large button that writes to the chain, with its own plain-language progress and errors. */
function BigAction({
  onClick,
  children,
  tone = "ink",
}: {
  onClick: () => Promise<unknown>;
  children: React.ReactNode;
  tone?: "ink" | "ok" | "bad" | "plain";
}) {
  const { refresh } = useSnapshot();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const style = {
    ink: "bg-ink text-on-ink hover:opacity-90",
    ok: "bg-ok text-on-ink hover:opacity-90",
    bad: "border-2 border-bad/60 bg-card text-bad hover:bg-bad/5",
    plain: "border-2 border-line bg-card text-ink hover:bg-sunk",
  }[tone];
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          let t: number | undefined;
          const timer = setTimeout(() => (t = toast?.start("正在寫入公開紀錄…")), 350);
          try {
            const r = await onClick();
            clearTimeout(timer);
            if (t) toast?.done(t, "已寫入公開紀錄", (r as { hash?: string } | undefined)?.hash);
            await refresh();
          } catch (e) {
            clearTimeout(timer);
            const msg = e instanceof Error ? e.message : String(e);
            const key = Object.keys(ERRORS_ZH).find((k) => msg.includes(k));
            const zh = key ? ERRORS_ZH[key] : "沒有成功，請再試一次。";
            setErr(zh);
            if (t) toast?.fail(t, zh);
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl px-6 text-xl font-semibold transition disabled:opacity-60",
          style,
        )}
      >
        {busy && <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent" />}
        {children}
      </button>
      {err && <p className="text-lg text-bad">{err}</p>}
    </div>
  );
}

export function LargeZhHousehold({ card, onCreate }: { card: HouseholdCard | null; onCreate: (c: HouseholdCard) => void }) {
  return (
    <div lang="zh-Hant" className="zh mx-auto max-w-xl space-y-5 text-[19px] leading-relaxed text-ink">
      {card ? (
        <WithCard card={card} />
      ) : (
        <Panel>
          <h2 className="text-[26px] font-semibold">還沒有救助憑證</h2>
          <p className="mt-2 text-muted">憑證存在這支手機裡，也可以印成卡片。村長或社工會陪您一起建立。</p>
          <div className="mt-6">
            <BigAction onClick={async () => onCreate(newCard("陳家（模擬）"))}>建立我的憑證</BigAction>
          </div>
        </Panel>
      )}
      <Panel className="bg-sunk/60">
        <p className="flex gap-3">
          <Icon.Shield className="mt-1 h-6 w-6 shrink-0 text-ok" />
          <span>您的姓名、身分證字號和銀行帳號，都不會公開。</span>
        </p>
        <p className="mt-3 flex gap-3 text-muted">
          <Icon.People className="mt-1 h-6 w-6 shrink-0" />
          <span>不方便操作？村裡登記的社工可以代您回答，您自己的回答永遠優先。</span>
        </p>
      </Panel>
    </div>
  );
}

function WithCard({ card }: { card: HouseholdCard }) {
  const { snap } = useSnapshot();
  const tier = useHouseholdTier(card);
  const receipt = useMemo(() => cardReceipt(card).address, [card]);
  const reg = registrationPayload(card);
  const registration = snap?.registrations.filter((r) => r.commitment.toString() === reg.commitment).at(-1);
  const scanned = useInbox<{ commitment: string }>("registration", true).some((m) => m.payload.commitment === reg.commitment);
  const registered = tier !== null && tier !== undefined;

  return (
    <>
      <Panel>
        <div className="flex items-center gap-3">
          <KeptMark className="h-8 w-8" seal={false} plain />
          <span className="text-[22px] font-semibold">{card.label}</span>
        </div>
        {tier === undefined ? (
          <p className="mt-5 text-muted">正在確認登記狀態…</p>
        ) : registered ? (
          <div className="mt-5 flex items-start gap-4">
            <span className="pop grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ok text-on-ink">
              <Icon.Check className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[24px] font-semibold text-ok">已登記完成</p>
              <p className="text-muted">村長和鄉公所都簽名了。災損：{TIERS_ZH[tier] ?? "已核定"}</p>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-[24px] font-semibold">還沒登記</p>
            <p className="mt-1 text-muted">要村長和鄉公所兩邊都簽名，才算登記完成。</p>
            <ol className="mt-4 grid grid-cols-2 gap-3">
              <SignatureStep done={registration?.status === 1} label="村長簽名" />
              <SignatureStep done={false} label="鄉公所簽名" />
            </ol>
            {registration?.status === 1 ? (
              <p className="mt-5">村長已經簽名了，等鄉公所簽名就完成。</p>
            ) : scanned ? (
              <p className="mt-5">村長已經收到您的條碼，等村長簽名。</p>
            ) : (
              <>
                <p className="mt-5">請把這個條碼給村長或鄉公所看。條碼裡沒有您的姓名。</p>
                <div className="mt-4">
                  <BigAction tone="plain" onClick={async () => postInbox("registration", reg)}>
                    模擬：村長掃描條碼
                  </BigAction>
                </div>
                <div className="mt-4 w-fit rounded-xl bg-white p-3 ring-1 ring-line">
                  <QRCodeSVG value={JSON.stringify(reg)} size={200} />
                </div>
              </>
            )}
          </div>
        )}
      </Panel>
      {registered && <Payments card={card} receipt={receipt} />}
      {registered && <StillWaiting card={card} />}
    </>
  );
}

function SignatureStep({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={cx("flex items-center gap-2 whitespace-nowrap rounded-xl border-2 px-3 py-3", done ? "border-ok/40 bg-ok/5" : "border-line")}>
      <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full", done ? "bg-ok text-on-ink" : "border-2 border-line")}>
        {done && <Icon.Check className="h-4 w-4" />}
      </span>
      {label}
    </li>
  );
}

function Payments({ card, receipt }: { card: HouseholdCard; receipt: Address }) {
  const { roles } = useSnapshot();
  const lines = useMyLines(receipt);
  const payer = (address: Address) => {
    const role = (Object.keys(roles) as RoleName[]).find((r) => roles[r]?.toLowerCase() === address.toLowerCase());
    return (role && ROLE_ZH[role]) ?? "救助單位";
  };
  return (
    <Panel>
      <h2 className="text-[26px] font-semibold">您的款項</h2>
      {lines === null ? (
        <p className="mt-3 text-muted">正在公開紀錄裡找您的款項…</p>
      ) : lines.length === 0 ? (
        <p className="mt-3 text-muted">目前還沒有款項紀錄。</p>
      ) : (
        <div className="mt-4 space-y-6">
          {lines.map((l) => (
            <PaymentLine key={`${l.hopId}-${l.batchIndex}`} l={l} card={card} payer={payer(l.custodian)} auditor={roles.auditor} />
          ))}
        </div>
      )}
    </Panel>
  );
}

function PaymentLine({ l, card, payer, auditor }: { l: MyLine; card: HouseholdCard; payer: string; auditor?: Address }) {
  return (
    <div className="rounded-2xl border border-line p-5">
      <p className="text-muted">{payer}登記已付給您</p>
      <p className="mt-1 text-[40px] font-semibold leading-tight tracking-tight tabular-nums">{ntd(l.amount)}</p>
      {l.state === 1 || l.state === 2 ? (
        <div className={cx("pop mt-5 flex items-start gap-4 rounded-xl px-4 py-4", l.state === 1 ? "bg-ok/10" : "bg-bad/10")}>
          <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-full text-on-ink", l.state === 1 ? "bg-ok" : "bg-bad")}>
            {l.state === 1 ? <Icon.Check className="h-6 w-6" /> : <Icon.Cross className="h-6 w-6" />}
          </span>
          <div>
            <p className={cx("text-[22px] font-semibold", l.state === 1 ? "text-ok" : "text-bad")}>{l.state === 1 ? "您回報：有收到" : "您回報：沒有收到"}</p>
            <p className="text-muted">
              {l.state === 1 ? "已記在公開紀錄上，任何人都改不了。" : "已記在公開紀錄上，所有人都看得到這筆款項有問題。"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-5 text-[24px] font-semibold">這筆錢，您有收到嗎？</p>
          {(l.state === 3 || l.state === 4) && (
            <p className="mt-1 text-muted">社工已代您回報「{l.state === 3 ? "有收到" : "沒有收到"}」。您自己的回答會取代它。</p>
          )}
          <div className="mt-4 grid gap-3">
            <BigAction tone="ok" onClick={() => answerLine(card, l, true)}>
              <Icon.Check className="h-6 w-6" /> 有，我收到了
            </BigAction>
            <BigAction tone="bad" onClick={() => answerLine(card, l, false)}>
              <Icon.Cross className="h-6 w-6" /> 沒有收到
            </BigAction>
          </div>
        </>
      )}
      {l.audit !== undefined && (
        <div className="mt-5 border-t border-line pt-5">
          {l.audit === 0 ? (
            <>
              <p className="font-semibold">您被抽中家訪。</p>
              <p className="text-muted">獨立的訪員會到您家。訪員在場時，在他面前按：</p>
              {auditor && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <BigAction tone="plain" onClick={() => signAuditVisit(card, l, true, auditor)}>
                    有收到
                  </BigAction>
                  <BigAction tone="plain" onClick={() => signAuditVisit(card, l, false, auditor)}>
                    沒有收到
                  </BigAction>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">家訪已記錄{l.audit === 1 ? "：您簽了「有收到」" : l.audit === 2 ? "：您簽了「沒有收到」" : ""}。</p>
          )}
        </div>
      )}
    </div>
  );
}

function StillWaiting({ card }: { card: HouseholdCard }) {
  const [village, setVillage] = useState<number>(VILLAGES[0].code);
  const waiting = useStillWaiting(card);
  if (!waiting.ready) return null;
  return (
    <Panel>
      <h2 className="text-[26px] font-semibold">還在等補助嗎？</h2>
      <p className="mt-2 text-muted">每週可以說一次，不會留下您的名字。外界只看得到每個村有幾戶還在等。</p>
      {waiting.sent ? (
        <p className="mt-5 flex items-start gap-3 rounded-xl bg-ok/10 px-4 py-4">
          <Icon.Check className="mt-1 h-6 w-6 shrink-0 text-ok" />
          本週已回報。下週如果還沒收到，可以再按一次。
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">我住在</span>
            <select
              value={village}
              onChange={(e) => setVillage(Number(e.target.value))}
              className="min-h-14 w-full rounded-xl border-2 border-line bg-card px-4 text-xl text-ink"
            >
              {VILLAGES.map((v) => (
                <option key={v.code} value={v.code}>
                  {v.zh}
                </option>
              ))}
            </select>
          </label>
          <BigAction tone="plain" onClick={() => waiting.report(village)}>
            我還在等
          </BigAction>
        </div>
      )}
    </Panel>
  );
}
