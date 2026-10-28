# 決賽前實作計畫（11/2–11/25）

> 2026-10-28 寫。前提：11/1 進入決賽名單才開工；10/30–11/1 評審看的版本不要動。
> 來源：`比賽檢討_他山之石_2026-10-27.md` 的教訓 1、2、3、4、9，對照 Kept 現在的程式碼。
> 決賽形式：11/26 SMU 現場，Tech Track 每隊 15 分鐘，現場展示原型，之後評審 Q&A。

## 總覽

| # | 項目 | 回應哪條教訓 | 工作量 | 優先 |
|---|---|---|---|---|
| A | 「試著作弊」區塊 | 9 讓評審親手作弊、4 內部人作弊 | 1.5–2 天 | 必做 |
| B | 錢跟著證據走：沒核銷就停撥 | 2 合約要有後果 | 3–4 天 | 必做 |
| C | 光復 48 筆真實轉帳匯入帳本 | 1 真實資料跑過產品 | 2–3 天 | 有餘力再做 |
| D | 決賽簡報與 Q&A：監督誘因、在地化、試辦指標 | 3、10、8 | 2 天 | 必做（不寫程式） |
| E | 換 logo（房子＋對話框） | — | 0.5 天 | 跟 A 一起上線 |

建議順序：A → B → D → C。B 會改合約、要重新部署，所以排在 A 之後，避免 A 做到一半時合約位址還在變。

**不做**：代幣、質押、挑戰保證金（Details 已寫明不發代幣，做了自相矛盾）；新增和這三項無關的功能。

---

## A. 「試著作弊」區塊

**目標**：評審在首頁第一屏按一個按鈕，就看到 Base Sepolia 上的真合約拒絕作弊，並顯示錯誤名稱。不花 gas、不改鏈上資料、不需要錢包。

**做法**：用 `eth_call` 模擬交易（viem `simulateContract`，可以指定 `account` 冒充任何地址），只讀不寫。這和 `/api/tx` 送出前先模擬的做法一樣，所以拒絕結果和真的送出交易時相同。

**四個按鈕**（都對應現有的 custom error，不需要改合約）：

| 按鈕上的文字 | 誰在作弊 | 呼叫 | 合約回傳 |
|---|---|---|---|
| 經手單位替受災戶按「已收到」 | 部會 | `CustodyLedger.confirmLine`，簽名用隨機金鑰而不是受災戶的收據金鑰 | `BadSignature` |
| 把錢撥去憲章以外的用途 | 委員會 | `ReliefFund` 撥款到 General public works | `PurposeNotInCharter` |
| 同一戶在同一個計畫領兩次 | NGO／受災戶 | `AidPrograms` 用已用過的 nullifier 再領一次 | `AlreadyClaimed` |
| 村長一個人就登記受災戶 | 村長 | `EligibilityRegistry` 用村長的身分核准自己提的登記 | `SameRoleCannotApprove` |

第五個可選：經手單位發布的付款名單裡，同一個收據地址出現兩次 → `DuplicateLine`。

**實作步驟**
1. `web/src/lib/cheats.ts`：定義上面四個情境（說明、冒充的地址、呼叫參數、預期錯誤）。參數從 `getDeployment()` 和種子資料取現有的 hopId、批次和 nullifier。
2. `web/src/app/api/cheat/route.ts`：只接受情境 id，伺服器端執行 `simulateContract`，回傳錯誤名稱、參數，以及合約在 Blockscout 上的連結。**不簽任何交易**，所以不會動到 demo 金鑰。
3. `web/src/components/try-to-cheat.tsx`：四張卡片，按下去顯示「Refused by the contract: `BadSignature`」，旁邊附一行白話說明。
4. 放在首頁 hero 下方，標題用「Try to cheat」；導覽列也加一個入口。
5. 測試：`web/scripts/e2e` 加 4 個檢查，每個情境都必須回傳預期的錯誤名稱；如果哪天交易「成功了」，測試要失敗。

**風險**：公共 RPC 偶爾逾時，所以要沿用 `seed.ts` 的 `simulateWithRetry`。現場 Demo 前一天要先按過一輪。

---

## B. 錢跟著證據走：前一筆沒交代，下一筆就停

**真實依據**：光復的錢有 98.8% 是預撥款，從 2025 年 12 月到 2026 年 8 月，一筆預撥款都沒有再核銷。現在的 `ReliefFund._apply` 撥款前完全不看下游狀況。

**規則**（寫進憲章、參數公開）：基金要撥款給 R 時，如果同一個基金先前撥給 R 的任何一筆款項，符合下面任一條件，撥款就 revert `RecipientOnHold(hopId, reason)`：
- (a) 撥款已超過 `RECONCILE_WINDOW`（預設 90 天，和現有「held over 90 days」警示同一個門檻），而 R 對這筆款項的核銷、轉出和計畫發放加起來，低於 `MIN_ACCOUNTED_BPS`（預設 50%）；
- (b) 這筆款項的付款名單中，回報「沒收到」（`disputed`）的比例超過 `MAX_DISPUTE_BPS`（預設 10%），而且還沒被稽核結果澄清。

**解除停撥**：R 補上核銷（`reconcile`），或稽核員的訪視結果顯示「其實有收到」，下一筆就自動恢復撥款。不另外設「人工解除」的開關，免得變成後門。緊急情況改用現有的 emergency 路徑：立即生效、事後公開檢討，並且在鏈上記錄是「繞過停撥」。

**合約修改**
- `CustodyLedger`
  - 新增 `mapping(address fund => mapping(address to => uint256[])) _hopsTo`，在 `recordAllocation` 時寫入。
  - 新增 `function holdReason(address fund, address to) external view returns (uint256 hopId, uint8 reason)`：只檢查最近 N 筆（例如 16 筆），控制 gas 上限。
  - `disputed` 要扣掉稽核訪視結果為 `VISIT_RECEIVED` 的筆數（要新增一個 `clearedDisputes` 計數）。
- `ReliefFund._apply`：在 Allocation 分支的 `token.safeTransfer` 之前呼叫 `ledger.holdReason(address(this), pr.recipient)`，非零就 revert。
- `KeptFactory`：把三個參數寫進憲章（建立基金時設定，之後只能透過受災戶可否決的 CapChange 類流程修改；第一版可以先設為不可修改）。

**測試**（`contracts/test`）
- 單元測試：第一筆撥款 → 91 天沒核銷 → 第二筆撥款 revert；補核銷到 50% 以上 → 第二筆成功；名單「沒收到」超過 10% → revert；稽核員訪視確認有收到 → 恢復。
- 不變量測試：新增一條「被停撥的收款方，餘額不會因為新的 Allocation 而增加」。
- `forge test` 全部通過後，更新 README 和 Details 裡的測試數量，並讓 `npm run verify:data` 檢查新的數字。

**前端**
- 委員會頁：撥款按鈕旁顯示「On hold: tranche #1 is 120 days old, 12% accounted for」。
- 公開儀表板：每個經手單位旁加一個「停撥中」標記。
- Demo 種子資料：預先放一筆超過 90 天的撥款。Base Sepolia 無法快轉時間，所以種子要在部署時把 `RECONCILE_WINDOW` 設成 5 分鐘，並清楚標示「demo: 90 days shortened to 5 minutes」，和現有 timelock 的處理方式一樣。

**重新部署**：合約要重新部署、在 Sourcify 和 Blockscout 驗證，並更新 `web` 的部署設定。**舊合約不要刪**：Details 和影片裡的交易連結指向舊合約，永遠有效。README 要寫清楚「Round 2 版本」和「決賽版本」各自的位址。

---

## C. 光復 48 筆真實轉帳匯入帳本

**目標**：讓 Kept 的警示在真實資料上亮燈，不只是畫圖。現場可以說：「這是光復的真實帳，第 8 個月這裡亮紅燈。」

**限制**：鏈上的 `createdAt` 是區塊時間，不能回溯到 2025 年。做法要誠實：
- 新增一個獨立的唯讀合約 `HistoricalImport`，記錄 48 筆轉帳。每筆包含原始日期（標註為「declared date」）、金額、收款單位代號、項目，以及月報編號和頁碼的 hash；同時記錄 11 期月報的核銷數字。
- 警示規則（超過 90 天、未核銷）用同一套前端邏輯，以申報日期計算。
- 頁面上明確寫：「Dates are as declared in the foundation's disclosures, imported on <日期>; the chain proves the import is unchanged, not that the dates are true.」

**步驟**：寫匯入腳本，讀取 `web/src/lib/replay/guangfu-2025.ts` 送上鏈，資料來源只有一份；在 /replay 加上「Kept's alerts on these records」時間軸；在 `verify:data` 新增檢查，確認鏈上 48 筆的金額總和等於 `SPENT_TOTAL`。

---

## D. 決賽簡報與 Q&A（不寫程式）

**1. 誰來監督、為什麼願意監督**（評審幾乎一定會問）
- 稽核員**按完成的訪視付費**，而且只有受災戶本人簽名的訪視紀錄才算完成，這個機制合約裡已經有了。
- 從稽核員的訪視中隨機抽一部分，請第二位稽核員複查。
- 稽核員標記「已收到」的戶，如果之後本人回報「沒收到」，這位稽核員會被公開標記。
- 費用來自基金的行政費額度。不發代幣，也不需要質押。

**2. 可行性與永續性（占評分 15%，影片裡講得最少）**
- 第一個採用者：全國性的賑災基金會。它已經公開每一筆轉帳，接上 Kept 的成本最低。
- 讓縣政府加入的方法：已經草擬了 39 條的花蓮自治條例學生版。
- 成本：以光復的規模，每場災害鏈上成本約 US$150–1,500；主要成本在人力稽核，而不是區塊鏈。
- 不需要任何人許可就能做的第一步：拿基金會已公開的資料，直接跑 Kept 的警示。

**3. 在地化**：做一頁說明這套機制放到新加坡或西班牙的情況。只用查證過的案例；2024 年瓦倫西亞 DANA 水災是真實事件，但當地捐款去向是否有爭議，**要先找到一手來源**才能寫。

**4. 事先寫下試辦指標**：例如回應率、從撥款到「已收到」的天數中位數、稽核抽中率。在簡報裡寫出目標，並承諾未達標也公布。

**5. 預先準備的 Q&A**：長者沒有手機（印出來的卡片、社工代簽）、抽樣的種子可以被操縱嗎（Known gaps，正式版改用 drand）、為什麼不用資料庫、個資問題。

**6. 影片裡說得不夠精確的六句話**：決賽現場改用 `presentation-script.md` v2.2 裡列的精確說法。

---

## E. 換 logo

- 用房子＋對話框的造型重畫成 SVG，配色改成橘色房子＋深藍線條（淺色底），或橘色房子＋米白線條（深藍底），不引入綠色。
- 要替換的地方：`web/src/components/icons.tsx`、favicon、README、`docs/assets/details/*.html`（重新產生 PNG）、決賽簡報，以及 DoraHacks 的 Build logo。
- 影片不重做：Round 2 影片保持原樣。

---

## 時程（假設 11/1 公布進入決賽）

| 日期 | 工作 |
|---|---|
| 11/2–11/3 | A 試著作弊＋E logo，部署 |
| 11/4–11/8 | B 合約、測試、前端，重新部署並驗證 |
| 11/9–11/10 | 更新 README、Details、verify:data |
| 11/11–11/14 | C（有餘力才做），否則提前進入 D |
| 11/15–11/20 | D 簡報、講稿，請導師給意見 |
| 11/21–11/25 | 彩排 3 次以上；Demo 備案（錄好的影片＋離線截圖），以防現場網路出問題 |
