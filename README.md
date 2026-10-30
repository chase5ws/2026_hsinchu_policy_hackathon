# 在地口袋嚮導 Demo｜2026 新竹政策黑客松

> 新竹人的口袋名單，帶你看見更有意思的新竹 — 智遊風城，無界探索

提案「在地口袋嚮導」的概念 Demo。純前端靜態網站，不需建置、不需後端或 API 金鑰，可直接用 GitHub Pages 發布。

## Demo 展示的流程（對應提案第 4 頁）

| 步驟 | 功能 |
|---|---|
| 01 AI 理解需求 | 輸入一句話（例：「我在新竹火車站，剩兩小時、沒有車，想吃小吃，也想散步。」），解析出時間、交通、興趣、素食、預算，也可直接點標籤調整 |
| 02 個人化速配卡 | 依條件配對在地口袋名單，顯示速配度、適合原因、在地人推薦理由、親訪時間；可愛心、收藏、換一張、加入行程 |
| 03 連結套票優惠 | 依是否持有風 PASS 給出確認清單，並連到官方網站（不假設已串接售票或核銷） |
| 04 AI 安排行程 | 一鍵排行程或手動加入；從新竹火車站出發再回來，估算步行時間、停留、花費，超時提示；每站可「換站」或移除；地圖顯示路線 |
| 分享口袋名單 | 在地人投稿表單（推薦理由至少 20 字、親訪時間必填），貢獻徽章，投稿以「待審核」加入速配卡 |
| 中英雙語 | 右上角切換 |

## 部署到 GitHub Pages

1. 把這些檔案 push 到 `main` 分支根目錄
2. GitHub repo → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 `main` / `(root)` → Save
3. 約一分鐘後網址為：`https://chase5ws.github.io/2026_-hsinchu_policy-hackathon/`

本機預覽：`python3 -m http.server 8000`，開 http://localhost:8000

## 檔案結構

```
index.html          頁面結構
assets/style.css    樣式（風城青 × 柿餅橘）
assets/data.js      示範資料：舊城生活圈 14 個地點、雙語推薦理由
assets/app.js       需求解析、配對評分、行程排序、地圖、投稿
.nojekyll           讓 GitHub Pages 直接提供靜態檔
```

要新增或修改地點，只需編輯 `assets/data.js` 的 `spots` 陣列。

## Demo 的界線（與提案一致）

- 「AI 理解需求」在 Demo 中以**關鍵字規則模擬**，正式版再接 LLM，並以資料查核交通、營業與票券限制。
- 地點為真實地標，但**推薦人是示範角色**、座標為概略值、步行時間以直線距離 × 1.35 估算。
- 營業時間、票價、風 PASS 內容一律以官方公告為準；Demo 不代表已取得任何合作。
- 投稿、愛心、收藏只存在瀏覽器 localStorage，不會上傳。
- 地圖使用 Leaflet + OpenStreetMap 圖資。

## 資料來源

- 觀光署《114 年臺灣旅遊狀況調查》摘要（2026.08.03 公布）
- 內政部 115 年第 18 週統計通報
- [新竹風 PASS 官方網站](https://hsinchupass.startravel.com.tw/)
- [TDX 運輸資料流通服務](https://tdx.transportdata.tw/data-service/basic)（後續交通資料候選）
