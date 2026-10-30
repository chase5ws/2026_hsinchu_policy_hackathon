/* 在地口袋嚮導 Demo — 前端邏輯（無後端、無 API 金鑰）
 * 「AI 理解需求」在 Demo 中以關鍵字規則模擬；正式版可替換為 LLM + 資料查核。
 */
(function () {
  "use strict";
  const D = window.POCKET_DATA;
  const ORIGIN = D.origin;

  /* ---------------- i18n ---------------- */
  const T = {
    zh: {
      brand: "在地口袋嚮導", tagline: "新竹人的口袋名單，帶你看見更有意思的新竹",
      tabExplore: "探索與行程", tabShare: "分享口袋名單", tabAbout: "關於提案",
      banner: "App 概念 Demo・示範資料：推薦人為示範角色，座標與步行時間為估算，營業時間與票價請以官方公告為準。免註冊即可瀏覽。",
      s1: "AI 理解需求", s2: "個人化速配卡", s3: "連結套票優惠", s4: "AI 安排行程",
      askLabel: "說說你現在的情況", askBtn: "幫我配對", tryLabel: "試試：",
      examples: [
        "我在新竹火車站，剩兩小時、沒有車，想吃小吃，也想散步。",
        "下雨天，想看展覽，一小時左右，吃素。",
        "半天，想看古蹟、買伴手禮，預算 500 元。"
      ],
      pTime: "時間", pMode: "交通", pInterest: "想要", pMore: "其他",
      modeWalk: "步行", modeBus: "步行＋公車",
      interests: { food: "小吃美食", walk: "散步", history: "歷史古蹟", art: "展覽文藝", sweet: "甜點伴手禮", nature: "綠地放鬆", indoor: "室內（下雨）" },
      veg: "素食", budget: (n) => `預算 ${n} 元內`,
      minutes: (m) => m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} 小時 ${m % 60} 分` : `${m / 60} 小時`) : `${m} 分`,
      parsedPrefix: "我理解的是：",
      parsedNone: "沒有抓到明確條件，先用預設（2 小時・步行）推薦，也可以直接點下方標籤調整。",
      like: "愛心", save: "收藏", next: "換一張", add: "加入行程", added: "已在行程",
      match: "速配度", walkFrom: (m) => `從車站步行約 ${m} 分`, stayAbout: (m) => `停留約 ${m} 分`,
      free: "免費", cost: (a, b) => a === b ? `約 ${a} 元` : `約 ${a}–${b} 元`,
      whyInterest: (s) => `符合你想要的：${s}`,
      whyNear: (m) => `離車站近，步行約 ${m} 分`,
      whyFar: (m) => `步行約 ${m} 分，距離稍遠`,
      whyFits: (t) => `來回加停留約 ${t} 分，放得進你的時間`,
      whyTight: (t) => `來回加停留約 ${t} 分，時間會有點趕`,
      whyVeg: "有素食選項",
      whyVegAsk: "素食者請先詢問店家",
      whyBudget: "符合預算",
      whyOverBudget: "可能超出預算",
      whyIndoor: "室內景點，下雨也能去",
      goodFor: "適合", tipLabel: "在地提醒", by: (n) => `在地分享者・${n}（示範）`, visited: (d) => `親訪 ${d}`,
      pending: "待審核",
      deckCount: (i, n) => `${i} / ${n}`,
      deckEmpty: "目前條件下沒有合適的卡片，試著放寬時間或興趣。",
      deckDone: "這輪卡片看完了，再按一次「換一張」從頭開始。",
      auto: "一鍵排行程", clear: "清空",
      planEmpty: "還沒有行程。把喜歡的速配卡「加入行程」，或按「一鍵排行程」。",
      planTotal: (t, b) => `<span class="big">${t}</span> / ${b}`,
      planCost: (c) => `餐飲與門票估計 ${c}`,
      over: "超出時間",
      start: "出發", back: "回到新竹火車站", walk: (m) => `步行約 ${m} 分`, bus: (m) => `公車或步行約 ${m} 分（估）`,
      swap: "換站", remove: "移除", up: "↑",
      planNote: "步行時間以直線距離 × 1.35 估算；正式版將以 TDX 交通資料、營業時間與票券條件查核，資料不足時會提示。",
      overWarn: (m) => `行程超出你的時間約 ${m} 分。可以移除一站，或按「換站」換成較近的地方。`,
      noSwap: "附近沒有更適合的替代地點了",
      swapped: (a, b) => `已將「${a}」換成「${b}」`,
      addedToast: (n) => `已加入行程：${n}`,
      autoToast: (n) => `已依你的條件排出 ${n} 站`,
      autoNone: "目前條件下排不出行程，試著拉長時間",
      passNo: "還沒有套票", passYes: "我已持有風 PASS",
      passBodyNo: (n) => `<p>你的行程有 <b>${n}</b> 個可能需要付費的餐飲或體驗點。首版只整理官方資訊與購票連結，不預設套票一定比較划算。</p><ul><li>比較套票內容與你實際會去的地點</li><li>留意使用期限、適用店家與預約條件</li></ul>`,
      passBodyYes: `<p>出發前請在官方網站確認：</p><ul><li>行程中的店家或體驗是否在適用名單</li><li>票券是否仍在有效期間、是否需事先預約</li></ul><p class="fine">正式版若取得合作資料，會直接標示可用項目；Demo 不假設已串接售票或核銷系統。</p>`,
      passLink: "前往新竹風 PASS 官方網站", passLinkSub: "套票內容、價格與條件依官方規定",
      planFab: (n) => `🗺 我的行程 · ${n} 站`,
      shareTitle: "每一份口袋名單，都有推薦的理由",
      shareLead: "說說為什麼推薦、適合誰、什麼時候去。通過審核的分享會署名顯示，並累積貢獻徽章。",
      rewardNote: "規劃：優質投稿與有效更新可換合作商家點數或優惠券，獎勵須審核並設上限；經費與合作尚待洽談。愛心數作為參考，不直接決定報酬。",
      fName: "地點名稱 *", fCat: "類型", fReason: "為什麼推薦？ *（至少 20 字）", fFor: "適合誰", fWhen: "親訪時間 *",
      fTip: "交通或注意事項", fBy: "署名（暱稱）", submit: "送出審核",
      cats: { food: "飲食", walk: "散步路線", history: "歷史景點", art: "展覽文藝" },
      errName: "請填寫地點名稱", errReason: "推薦理由至少 20 字，說說為什麼推薦、適合誰", errWhen: "請填寫親訪時間",
      submitted: "已送出！審核通過後會出現在速配卡中（Demo 中以「待審核」先行顯示）",
      myShares: "我的分享", noShares: "還沒有分享。寫下你的第一個口袋地點吧！",
      anon: "匿名在地人",
      badges: [["🌱", "新手嚮導", "分享 1 則"], ["🧭", "巷弄達人", "分享 3 則"], ["🏮", "風城守門人", "分享 10 則"]],
      likesGot: (n) => `收到 ${n} 個愛心（示範）`,
      del: "刪除",
      aboutTitle: "智遊風城，無界探索",
      aboutLead: "免費 App 以在地推薦理由為核心，串起個人化推薦、交通、行程與旅遊優惠。",
      stat1: "國旅旅次 2024→2025（2.22 → 2.48 億旅次）", stat2: "國旅自行規劃行程比例（2025）", stat3: "2025 年底新竹市在臺外僑居留人數（非旅客數）",
      roadmap: "推進計畫", rh1: "階段", rh2: "內容", rh3: "觀察重點",
      r1a: "短期：Demo（本頁）", r1b: "展示輸入、推薦、換站、行程與套票", r1c: "核心流程是否完整呈現",
      r2a: "中期：試用", r2b: "新竹火車站周邊舊城生活圈小範圍試用", r2c: "推薦適合度、路線可行性、再次使用",
      r3a: "長期：擴大", r3b: "依回饋擴充區域、內容及語言", r3c: "有效投稿、使用回饋、維運成本",
      aboutNote: "現階段為提案，試辦範圍、經費及合作待確認，尚無實測成果。全國調查作為設計依據，非新竹專屬需求。",
      sourcesTitle: "資料來源",
      footer: "2026 新竹政策黑客松・在地口袋嚮導提案 Demo。本頁為概念展示，非正式服務。",
      mapFail: "地圖載入失敗（可能離線），行程時間仍可正常計算。",
      lang: "EN", colon: "："
    },
    en: {
      brand: "Pocket Guide Hsinchu", tagline: "Locals' pocket lists for a more interesting Hsinchu",
      tabExplore: "Explore & Plan", tabShare: "Share a Spot", tabAbout: "About",
      banner: "Concept demo with sample data: recommenders are sample personas; coordinates and walking times are estimates; check official sources for hours and prices. No sign-up needed.",
      s1: "Understand your needs", s2: "Your match cards", s3: "Travel pass offers", s4: "Plan the route",
      askLabel: "Tell us your situation", askBtn: "Match me", tryLabel: "Try:",
      examples: [
        "I'm at Hsinchu Station with 2 hours, no car. I want snacks and a walk.",
        "Rainy day, want an exhibition, about 1 hour, vegetarian.",
        "Half a day, old historic sites and souvenirs, budget 500."
      ],
      pTime: "Time", pMode: "Getting around", pInterest: "Into", pMore: "Other",
      modeWalk: "Walk", modeBus: "Walk + bus",
      interests: { food: "Local food", walk: "Walking", history: "History", art: "Art & film", sweet: "Sweets & souvenirs", nature: "Green space", indoor: "Indoor (rain)" },
      veg: "Vegetarian", budget: (n) => `Under NT$${n}`,
      minutes: (m) => m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`) : `${m} min`,
      parsedPrefix: "Here's what I understood: ",
      parsedNone: "No clear conditions found — using defaults (2 h, walking). Adjust with the tags below.",
      like: "Like", save: "Save", next: "Next", add: "Add to plan", added: "In plan",
      match: "MATCH", walkFrom: (m) => `~${m} min walk from station`, stayAbout: (m) => `~${m} min stay`,
      free: "Free", cost: (a, b) => a === b ? `~NT$${a}` : `~NT$${a}–${b}`,
      whyInterest: (s) => `Matches what you want: ${s}`,
      whyNear: (m) => `Close to the station, ~${m} min walk`,
      whyFar: (m) => `~${m} min walk, a bit further out`,
      whyFits: (t) => `~${t} min round trip incl. stay — fits your time`,
      whyTight: (t) => `~${t} min round trip incl. stay — a little tight`,
      whyVeg: "Vegetarian options",
      whyVegAsk: "Vegetarians: ask the shop first",
      whyBudget: "Within budget",
      whyOverBudget: "May exceed budget",
      whyIndoor: "Indoor — fine in the rain",
      goodFor: "Good for", tipLabel: "Local tip", by: (n) => `Local sharer · ${n} (sample)`, visited: (d) => `Visited ${d}`,
      pending: "Pending review",
      deckCount: (i, n) => `${i} / ${n}`,
      deckEmpty: "No cards fit right now — try more time or other interests.",
      deckDone: "You've seen this round. Tap Next to start over.",
      auto: "Auto-plan", clear: "Clear",
      planEmpty: "No plan yet. Add cards you like, or tap Auto-plan.",
      planTotal: (t, b) => `<span class="big">${t}</span> / ${b}`,
      planCost: (c) => `Food & tickets est. ${c}`,
      over: "Over time",
      start: "Start", back: "Back to Hsinchu Station", walk: (m) => `~${m} min walk`, bus: (m) => `~${m} min by bus or on foot (est.)`,
      swap: "Swap", remove: "Remove", up: "↑",
      planNote: "Walking time = straight-line distance × 1.35. The full version will check TDX transit data, opening hours and ticket rules, and flag missing data.",
      overWarn: (m) => `This plan runs ~${m} min over your time. Remove a stop or Swap for somewhere closer.`,
      noSwap: "No better alternative nearby",
      swapped: (a, b) => `Swapped "${a}" for "${b}"`,
      addedToast: (n) => `Added: ${n}`,
      autoToast: (n) => `Planned ${n} stops for you`,
      autoNone: "Couldn't fit a plan — try allowing more time",
      passNo: "No pass yet", passYes: "I have a Wind PASS",
      passBodyNo: (n) => `<p>Your plan has <b>${n}</b> food or experience stops that may cost money. This version only links official pass info — a pass isn't assumed to be cheaper.</p><ul><li>Compare what's included with where you'll actually go</li><li>Check validity dates, partner shops and booking rules</li></ul>`,
      passBodyYes: `<p>Before you go, check on the official site:</p><ul><li>Whether your stops are on the partner list</li><li>That your pass is still valid and whether booking is needed</li></ul><p class="fine">With partner data, the full version would mark eligible stops. This demo assumes no ticketing or redemption integration.</p>`,
      passLink: "Visit the Hsinchu Wind PASS site", passLinkSub: "Contents, prices and conditions per official rules",
      planFab: (n) => `🗺 My plan · ${n}`,
      shareTitle: "Every pocket list comes with a reason",
      shareLead: "Tell us why you recommend it, who it suits and when to go. Approved shares are credited and earn contributor badges.",
      rewardNote: "Planned: quality posts and useful updates may earn partner points or coupons, subject to review and caps; funding and partners are not yet confirmed. Likes are a signal, not a payout formula.",
      fName: "Place name *", fCat: "Type", fReason: "Why do you recommend it? * (20+ characters)", fFor: "Who is it for", fWhen: "When you visited *",
      fTip: "Getting there / heads-up", fBy: "Credit as (nickname)", submit: "Submit for review",
      cats: { food: "Food", walk: "Walking route", history: "Historic site", art: "Art & culture" },
      errName: "Please enter a place name", errReason: "Give a reason of at least 20 characters — why, and who it suits", errWhen: "Please add when you visited",
      submitted: "Submitted! Once approved it joins the match cards (shown as Pending in this demo).",
      myShares: "My shares", noShares: "Nothing shared yet. Add your first pocket spot!",
      anon: "Anonymous local",
      badges: [["🌱", "Rookie Guide", "1 share"], ["🧭", "Alley Expert", "3 shares"], ["🏮", "Wind City Keeper", "10 shares"]],
      likesGot: (n) => `${n} likes received (sample)`,
      del: "Delete",
      aboutTitle: "Smart travel in the Wind City",
      aboutLead: "A free app built around locals' reasons to recommend, linking personalised picks, transit, itineraries and travel offers.",
      stat1: "Domestic trips 2024→2025 (222M → 248M)", stat2: "Domestic travellers who plan their own trips (2025)", stat3: "Foreign residents in Hsinchu City, end-2025 (not visitors)",
      roadmap: "Roadmap", rh1: "Stage", rh2: "Plan", rh3: "What we check",
      r1a: "Short term: Demo (this page)", r1b: "Show input, matching, swapping, planning and passes", r1c: "Core flow is complete",
      r2a: "Mid term: Pilot", r2b: "Small pilot in the old town around Hsinchu Station", r2c: "Match quality, route feasibility, return use",
      r3a: "Long term: Scale", r3b: "Expand areas, content and languages from feedback", r3c: "Quality posts, feedback, running costs",
      aboutNote: "This is a proposal. Pilot scope, funding and partners are unconfirmed and there are no field results yet. National survey data informs the design but isn't Hsinchu-specific.",
      sourcesTitle: "Sources",
      footer: "2026 Hsinchu Policy Hackathon · Pocket Guide proposal demo. Concept only, not a live service.",
      mapFail: "Map failed to load (offline?). Times are still calculated.",
      lang: "中文", colon: ": "
    }
  };

  /* ---------------- storage (best-effort) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("pg_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("pg_" + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------------- state ---------------- */
  const S = {
    lang: store.get("lang", "zh"),
    prefs: { minutes: 120, mode: "walk", interests: ["food", "walk"], veg: false, budget: null },
    deck: [], idx: 0,
    liked: new Set(store.get("liked", [])),
    saved: new Set(store.get("saved", [])),
    plan: [],
    pass: "no",
    shares: store.get("shares", [])
  };
  const t = () => T[S.lang];
  const nm = (o) => (o && typeof o === "object") ? (o[S.lang] || o.zh) : o;

  /* ---------------- geo ---------------- */
  function meters(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function legMin(a, b) {
    const walk = Math.max(2, Math.round(meters(a, b) * 1.35 / 75));
    if (S.prefs.mode === "bus" && walk > 12) return { min: Math.round(8 + walk * 0.4), kind: "bus" };
    return { min: walk, kind: "walk" };
  }

  /* ---------------- all spots (incl. user shares) ---------------- */
  function allSpots() {
    const mine = S.shares.map((s) => ({
      id: s.id, name: { zh: s.name, en: s.name }, cat: s.cat,
      tags: [s.cat, "local"], lat: s.lat, lng: s.lng, stay: 25,
      cost: s.cat === "food" ? [100, 250] : [0, 0], veg: "partial", emoji: "📌",
      reason: { zh: s.reason, en: s.reason }, tip: { zh: s.tip, en: s.tip },
      goodFor: { zh: s.forWho, en: s.forWho }, by: { zh: s.by, en: s.by }, visited: s.when,
      pending: true
    }));
    return D.spots.concat(mine);
  }
  const byId = (id) => allSpots().find((s) => s.id === id);

  /* ---------------- "AI" parsing (rule-based in demo) ---------------- */
  function parse(text) {
    const s = text.toLowerCase();
    const p = { minutes: null, mode: null, interests: [], veg: null, budget: null };
    const num = (str) => {
      const map = { "一": 1, "兩": 2, "二": 2, "三": 3, "四": 4, "五": 5, "半": 0.5 };
      return map[str] != null ? map[str] : parseFloat(str);
    };
    let m;
    if (/半天|half a day|half-day/.test(s)) p.minutes = 240;
    else if ((m = s.match(/([0-9.]+|[一兩二三四五])\s*(個)?\s*(小時|hours?|hrs?|h\b)/))) p.minutes = Math.round(num(m[1]) * 60);
    else if ((m = s.match(/([0-9]+)\s*(分鐘|分|min)/))) p.minutes = parseInt(m[1], 10);
    else if (/一小時|an hour|one hour/.test(s)) p.minutes = 60;
    if (p.minutes) p.minutes = Math.min(300, Math.max(45, p.minutes));

    if (/沒有車|沒車|走路|步行|no car|on foot|walking distance/.test(s)) p.mode = "walk";
    if (/公車|巴士|bus/.test(s)) p.mode = "bus";

    const kw = {
      food: /小吃|想吃|好吃|吃點|吃東西|美食|餐|snack|food|eat|lunch|dinner/,
      walk: /散步|走走|逛|walk|stroll/,
      history: /古蹟|歷史|老街|廟|history|historic|heritage|temple|old/,
      art: /展|美術|博物館|電影|文藝|exhibit|museum|art|gallery|film/,
      sweet: /甜點|伴手禮|點心|souvenir|dessert|sweet|cake/,
      nature: /公園|綠|湖|放鬆|park|green|nature|relax|lake/,
      indoor: /下雨|雨天|室內|rain|indoor/
    };
    Object.keys(kw).forEach((k) => { if (kw[k].test(s)) p.interests.push(k); });
    if (/素|vegetarian|vegan/.test(s)) p.veg = true;
    if ((m = s.match(/(預算|budget|nt\$?)\s*([0-9]{2,5})/)) || (m = s.match(/([0-9]{2,5})\s*(元|塊|nt)/))) {
      p.budget = parseInt(m[2] && /\d/.test(m[2]) ? m[2] : m[1], 10);
    }
    return p;
  }

  function applyParsed(p) {
    let hits = 0;
    if (p.minutes) { S.prefs.minutes = p.minutes; hits++; }
    if (p.mode) { S.prefs.mode = p.mode; hits++; }
    if (p.interests.length) { S.prefs.interests = p.interests; hits++; }
    S.prefs.veg = !!p.veg; if (p.veg) hits++;
    S.prefs.budget = p.budget || null; if (p.budget) hits++;
    return hits;
  }

  function describePrefs() {
    const L = t(), P = S.prefs, parts = [];
    parts.push(`<b>${L.minutes(P.minutes)}</b>`);
    parts.push(`<b>${P.mode === "walk" ? L.modeWalk : L.modeBus}</b>`);
    if (P.interests.length) parts.push(`<b>${P.interests.map((i) => L.interests[i]).join("、")}</b>`);
    if (P.veg) parts.push(`<b>${L.veg}</b>`);
    if (P.budget) parts.push(`<b>${L.budget(P.budget)}</b>`);
    return parts.join(" · ");
  }

  /* ---------------- scoring ---------------- */
  function interestHits(spot) {
    const tags = spot.tags.slice();
    if (tags.includes("souvenir")) tags.push("sweet");
    return S.prefs.interests.filter((i) => tags.includes(i));
  }
  function evaluate(spot) {
    const L = t(), P = S.prefs, why = [];
    let score = 0;
    const hits = interestHits(spot);
    score += hits.length * 22;
    if (hits.length) why.push({ txt: L.whyInterest(hits.map((h) => L.interests[h]).join("、")) });

    const leg = legMin(ORIGIN, spot).min;
    const round = leg * 2 + spot.stay;
    if (leg <= 8) { score += 10; why.push({ txt: L.whyNear(leg) }); }
    else if (leg > 15) { score -= (leg - 15) * 1.5; why.push({ txt: L.whyFar(leg), warn: true }); }
    if (round <= P.minutes * 0.6) why.push({ txt: L.whyFits(round) });
    else if (round <= P.minutes) { score -= 6; why.push({ txt: L.whyTight(round), warn: true }); }
    else score -= 60;

    if (P.veg && spot.cat === "food") {
      if (spot.veg === "yes") { score += 8; why.push({ txt: L.whyVeg }); }
      else if (spot.veg === "partial") { score -= 4; why.push({ txt: L.whyVegAsk, warn: true }); }
    }
    if (P.budget) {
      if (spot.cost[0] > P.budget) { score -= 30; why.push({ txt: L.whyOverBudget, warn: true }); }
      else if (spot.cost[1] > 0) { why.push({ txt: L.whyBudget }); }
    }
    if (P.interests.includes("indoor") && spot.tags.includes("indoor")) why.push({ txt: L.whyIndoor });
    if (!hits.length) score -= 15;
    if (S.liked.has(spot.id)) score += 3;
    const pct = Math.round(Math.max(40, Math.min(98, 58 + score)));
    return { score, pct, why: why.slice(0, 4), leg, round };
  }

  function buildDeck() {
    S.deck = allSpots()
      .map((s) => ({ s, e: evaluate(s) }))
      .filter((x) => x.e.round <= S.prefs.minutes && !(S.prefs.budget && x.s.cost[0] > S.prefs.budget))
      .sort((a, b) => b.e.score - a.e.score)
      .map((x) => x.s.id);
    S.idx = 0;
  }

  /* ---------------- planning ---------------- */
  function orderPlan(ids) {
    const rest = ids.slice(), out = [];
    let cur = ORIGIN;
    while (rest.length) {
      rest.sort((a, b) => meters(cur, byId(a)) - meters(cur, byId(b)));
      const n = rest.shift(); out.push(n); cur = byId(n);
    }
    return out;
  }
  function planStats(ids) {
    let cur = ORIGIN, total = 0, cost = [0, 0];
    const legs = [];
    ids.forEach((id) => {
      const s = byId(id), l = legMin(cur, s);
      legs.push(l); total += l.min + s.stay; cost[0] += s.cost[0]; cost[1] += s.cost[1]; cur = s;
    });
    const back = ids.length ? legMin(cur, ORIGIN) : { min: 0, kind: "walk" };
    total += back.min;
    return { legs, back, total, cost };
  }
  function autoPlan() {
    const cands = S.deck.length ? S.deck.slice() : [];
    const chosen = [];
    const wantFood = S.prefs.interests.includes("food");
    let guard = 0;
    while (guard++ < 10) {
      let best = null, bestVal = -Infinity;
      cands.forEach((id) => {
        if (chosen.includes(id)) return;
        const trial = orderPlan(chosen.concat(id));
        const st = planStats(trial);
        if (st.total > S.prefs.minutes) return;
        if (S.prefs.budget && st.cost[0] > S.prefs.budget) return;
        const s = byId(id), ev = evaluate(s);
        let val = ev.score - (st.total - planStats(orderPlan(chosen)).total) * 0.8;
        if (wantFood && s.cat === "food" && !chosen.some((c) => byId(c).cat === "food")) val += 25;
        if (chosen.some((c) => byId(c).cat === s.cat)) val -= 6; // variety
        if (val > bestVal) { bestVal = val; best = id; }
      });
      if (!best || bestVal < -20) break;
      chosen.push(best);
    }
    return orderPlan(chosen);
  }
  function swapStop(id) {
    const old = byId(id);
    const others = S.plan.filter((x) => x !== id);
    let best = null, bestVal = -Infinity;
    allSpots().forEach((s) => {
      if (S.plan.includes(s.id)) return;
      const st = planStats(orderPlan(others.concat(s.id)));
      const ev = evaluate(s);
      let val = ev.score - Math.max(0, st.total - S.prefs.minutes) * 3;
      if (s.cat === old.cat) val += 12;
      if (val > bestVal) { bestVal = val; best = s; }
    });
    if (!best) { toast(t().noSwap); return; }
    S.plan = orderPlan(others.concat(best.id));
    toast(t().swapped(nm(old.name), nm(best.name)));
    renderPlan();
  }

  /* ---------------- render: static text ---------------- */
  function applyStatic() {
    const L = t();
    document.documentElement.lang = S.lang === "zh" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = L[el.getAttribute("data-i18n")];
      if (typeof v === "string") el.textContent = v;
    });
    $("#langBtn").textContent = L.lang;
    document.querySelectorAll(".ex").forEach((b) => { b.textContent = L.examples[+b.dataset.ex]; });
    const cat = $("#fCat"); const cur = cat.value;
    cat.innerHTML = Object.keys(L.cats).map((k) => `<option value="${k}">${L.cats[k]}</option>`).join("");
    if (cur) cat.value = cur;
    $("#sources").innerHTML = D.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(nm(s))}</a></li>`).join("");
  }

  /* ---------------- render: prefs ---------------- */
  function chip(label, on, attrs) {
    return `<button class="chip${on ? " on" : ""}" ${attrs} aria-pressed="${on}">${esc(label)}</button>`;
  }
  function renderPrefs() {
    const L = t(), P = S.prefs;
    $("#pTime").innerHTML = [60, 120, 180, 240].map((m) => chip(L.minutes(m), P.minutes === m, `data-time="${m}"`)).join("");
    $("#pMode").innerHTML = chip(L.modeWalk, P.mode === "walk", 'data-mode="walk"') + chip(L.modeBus, P.mode === "bus", 'data-mode="bus"');
    $("#pInterest").innerHTML = Object.keys(L.interests).map((k) => chip(L.interests[k], P.interests.includes(k), `data-int="${k}"`)).join("");
    $("#pMore").innerHTML = chip("🌱 " + L.veg, P.veg, 'data-veg="1"') +
      [200, 500].map((b) => chip(L.budget(b), P.budget === b, `data-budget="${b}"`)).join("");
  }

  /* ---------------- render: card ---------------- */
  function renderCard(animate) {
    const L = t(), el = $("#card");
    if (!S.deck.length) {
      el.innerHTML = `<div class="card-empty">${L.deckEmpty}</div>`;
      $("#deckCount").textContent = "";
      setActionState(null); return;
    }
    if (S.idx >= S.deck.length) {
      el.innerHTML = `<div class="card-empty">${L.deckDone}</div>`;
      $("#deckCount").textContent = L.deckCount(S.deck.length, S.deck.length);
      setActionState(null); return;
    }
    const s = byId(S.deck[S.idx]), e = evaluate(s);
    const costTxt = s.cost[1] === 0 ? L.free : L.cost(s.cost[0], s.cost[1]);
    el.innerHTML = `
      <div class="card-hero ${s.cat}">
        <div class="card-emoji" aria-hidden="true">${s.emoji}</div>
        <div class="card-match"><div class="pct">${e.pct}%</div><div class="lbl">${L.match}</div></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${esc(nm(s.name))}${s.pending ? `<span class="pending-tag">${L.pending}</span>` : ""}</h3>
        <div class="card-meta">
          <span>🚶 ${L.walkFrom(e.leg)}</span><span>⏱ ${L.stayAbout(s.stay)}</span><span>💰 ${costTxt}</span>
        </div>
        <ul class="why">${e.why.map((w) => `<li${w.warn ? ' class="warn"' : ""}>${esc(w.txt)}</li>`).join("")}</ul>
        <blockquote class="quote">${S.lang === "zh" ? "「" : "“"}${esc(nm(s.reason))}${S.lang === "zh" ? "」" : "”"}
          <div class="quote-by"><span>— ${esc(s.pending ? (nm(s.by) || L.anon) : L.by(nm(s.by)))}</span><span>${L.visited(esc(s.visited || ""))}</span></div>
        </blockquote>
        ${nm(s.goodFor) ? `<div class="tip"><b>${L.goodFor}${L.colon}</b>${esc(nm(s.goodFor))}</div>` : ""}
        ${nm(s.tip) ? `<div class="tip"><b>${L.tipLabel}${L.colon}</b>${esc(nm(s.tip))}</div>` : ""}
      </div>`;
    if (animate) { el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter"); }
    $("#deckCount").textContent = L.deckCount(S.idx + 1, S.deck.length);
    setActionState(s);
  }
  function setActionState(s) {
    const L = t();
    const like = $("#likeBtn"), save = $("#saveBtn"), add = $("#addBtn");
    [like, save, add].forEach((b) => { b.disabled = !s; });
    if (!s) return;
    const lk = S.liked.has(s.id), sv = S.saved.has(s.id), inPlan = S.plan.includes(s.id);
    like.setAttribute("aria-pressed", lk); like.querySelector(".ic").textContent = lk ? "♥" : "♡";
    save.setAttribute("aria-pressed", sv); save.querySelector(".ic").textContent = sv ? "★" : "☆";
    add.querySelector(".ic").textContent = inPlan ? "✓" : "＋";
    add.querySelector("span:last-child").textContent = inPlan ? L.added : L.add;
  }

  /* ---------------- render: plan ---------------- */
  let map = null, layer = null;
  function initMap() {
    if (!window.L) { $("#map").innerHTML = `<div class="map-fallback">${t().mapFail}</div>`; return; }
    try {
      map = window.L.map("map", { zoomControl: true, scrollWheelZoom: false, attributionControl: true })
        .setView([ORIGIN.lat + 0.002, ORIGIN.lng - 0.002], 15);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);
      layer = window.L.layerGroup().addTo(map);
    } catch (e) { map = null; $("#map").innerHTML = `<div class="map-fallback">${t().mapFail}</div>`; }
  }
  function drawMap() {
    if (!map) return;
    const L = window.L;
    layer.clearLayers();
    const pinIcon = (label, cls) => L.divIcon({ className: "", html: `<div class="pin ${cls || ""}"><span>${label}</span></div>`, iconSize: [26, 26], iconAnchor: [13, 26] });
    allSpots().forEach((s) => {
      if (S.plan.includes(s.id)) return;
      L.marker([s.lat, s.lng], { icon: L.divIcon({ className: "", html: '<div class="dot"></div>', iconSize: [10, 10], iconAnchor: [5, 5] }) })
        .bindTooltip(nm(s.name)).addTo(layer);
    });
    L.marker([ORIGIN.lat, ORIGIN.lng], { icon: pinIcon("🚉", "origin"), zIndexOffset: 500 }).bindTooltip(nm(ORIGIN.name)).addTo(layer);
    const pts = [[ORIGIN.lat, ORIGIN.lng]];
    S.plan.forEach((id, i) => {
      const s = byId(id); pts.push([s.lat, s.lng]);
      L.marker([s.lat, s.lng], { icon: pinIcon(i + 1), zIndexOffset: 1000 }).bindTooltip(`${i + 1}. ${nm(s.name)}`).addTo(layer);
    });
    if (S.plan.length) {
      pts.push([ORIGIN.lat, ORIGIN.lng]);
      L.polyline(pts, { color: "#e0662f", weight: 3, dashArray: "6 6", opacity: .9 }).addTo(layer);
      map.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 16 });
    }
  }
  function renderPlan() {
    const L = t(), P = S.prefs, st = planStats(S.plan);
    const over = st.total - P.minutes;
    const costTxt = st.cost[1] === 0 ? L.free : L.cost(st.cost[0], st.cost[1]);
    $("#planSummary").innerHTML = S.plan.length
      ? `${L.planTotal(L.minutes(st.total), L.minutes(P.minutes))}${over > 0 ? ` <span class="over">${L.over}</span>` : ""}<br>${L.planCost(costTxt)}`
      : `<span class="big">0</span> / ${L.minutes(P.minutes)}`;
    const fill = $("#budgetFill");
    fill.style.width = Math.min(100, st.total / P.minutes * 100) + "%";
    fill.classList.toggle("over", over > 0);

    const tl = $("#timeline");
    if (!S.plan.length) {
      tl.innerHTML = `<li class="plan-empty">${L.planEmpty}</li>`;
    } else {
      let clock = 0, html = "";
      html += `<li class="tl-item"><div class="tl-num origin">🚉</div><div class="tl-main"><div class="tl-name">${esc(nm(ORIGIN.name))}</div><div class="tl-sub">${L.start}</div></div><div class="tl-time">0:00</div></li>`;
      S.plan.forEach((id, i) => {
        const s = byId(id), leg = st.legs[i];
        html += `<li class="tl-leg"><div class="line"></div><div>${leg.kind === "bus" ? "🚌 " + L.bus(leg.min) : "🚶 " + L.walk(leg.min)}</div></li>`;
        clock += leg.min;
        html += `<li class="tl-item"><div class="tl-num">${i + 1}</div><div class="tl-main">
            <div class="tl-name">${s.emoji} ${esc(nm(s.name))}</div>
            <div class="tl-sub">${L.stayAbout(s.stay)} · ${s.cost[1] === 0 ? L.free : L.cost(s.cost[0], s.cost[1])}</div>
            <div class="tl-ops"><button class="mini" data-swap="${id}">↻ ${L.swap}</button><button class="mini" data-remove="${id}">✕ ${L.remove}</button></div>
          </div><div class="tl-time">${fmtClock(clock)}–${fmtClock(clock + s.stay)}</div></li>`;
        clock += s.stay;
      });
      html += `<li class="tl-leg"><div class="line"></div><div>${st.back.kind === "bus" ? "🚌 " + L.bus(st.back.min) : "🚶 " + L.walk(st.back.min)}</div></li>`;
      clock += st.back.min;
      html += `<li class="tl-item"><div class="tl-num origin">🏁</div><div class="tl-main"><div class="tl-name">${L.back}</div></div><div class="tl-time">${fmtClock(clock)}</div></li>`;
      if (over > 0) html += `<li class="warn-box">${L.overWarn(over)}</li>`;
      tl.innerHTML = html;
    }
    $("#planFab").textContent = L.planFab(S.plan.length);
    drawMap();
    renderPass();
    if (S.deck.length && S.idx < S.deck.length) setActionState(byId(S.deck[S.idx]));
  }
  function fmtClock(m) { return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; }

  function renderPass() {
    const L = t();
    document.querySelectorAll("[data-pass]").forEach((b) => b.classList.toggle("on", b.dataset.pass === S.pass));
    const paid = S.plan.filter((id) => { const s = byId(id); return s.cost[1] > 0; }).length;
    $("#passBody").innerHTML = (S.pass === "yes" ? L.passBodyYes : L.passBodyNo(paid)) +
      `<a class="pass-link" href="${D.pass.url}" target="_blank" rel="noopener"><span><b>${L.passLink}</b><br><span class="fine">${L.passLinkSub}</span></span><span aria-hidden="true">↗</span></a>`;
  }

  /* ---------------- share ---------------- */
  function renderShare() {
    const L = t(), n = S.shares.length;
    const need = [1, 3, 10];
    $("#badgeBox").innerHTML = L.badges.map((b, i) =>
      `<div class="badge${n >= need[i] ? "" : " locked"}"><span class="b-ic">${b[0]}</span><span><b>${b[1]}</b><br><span class="fine">${b[2]}</span></span></div>`
    ).join("");
    $("#shareList").innerHTML = n ? S.shares.slice().reverse().map((s) => `
      <li class="share-item">
        <div class="top"><b>📌 ${esc(s.name)} <span class="pending-tag">${L.pending}</span></b><button class="mini" data-del="${s.id}">${L.del}</button></div>
        <div class="r">${S.lang === "zh" ? "「" : "“"}${esc(s.reason)}${S.lang === "zh" ? "」" : "”"}</div>
        <div class="m">${esc(L.cats[s.cat] || "")} · ${L.visited(esc(s.when))} · ${esc(s.by || L.anon)}</div>
      </li>`).join("") : `<li class="fine">${L.noShares}</li>`;
  }
  function submitShare(ev) {
    ev.preventDefault();
    const L = t();
    const name = $("#fName").value.trim(), reason = $("#fReason").value.trim(), when = $("#fWhen").value;
    const err = $("#formErr");
    if (!name) { err.textContent = L.errName; $("#fName").focus(); return; }
    if (reason.length < 20) { err.textContent = L.errReason; $("#fReason").focus(); return; }
    if (!when) { err.textContent = L.errWhen; $("#fWhen").focus(); return; }
    err.textContent = "";
    // 投稿位置：Demo 中放在舊城中心附近的隨機點（正式版由地圖選點或地址定位）
    const jitter = () => (Math.random() - 0.5) * 0.004;
    S.shares.push({
      id: "u" + Date.now(), name, reason, when: when.replace("-", "/"), cat: $("#fCat").value,
      forWho: $("#fFor").value.trim(), tip: $("#fTip").value.trim(), by: $("#fBy").value.trim(),
      lat: 24.8045 + jitter(), lng: 120.9680 + jitter()
    });
    store.set("shares", S.shares);
    ev.target.reset(); $("#reasonCount").textContent = "0";
    renderShare(); buildDeck(); renderCard(false);
    toast(L.submitted);
  }

  /* ---------------- utils ---------------- */
  function $(q) { return document.querySelector(q); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  function refreshAll(animate) { buildDeck(); renderPrefs(); renderCard(animate); renderPlan(); }

  /* ---------------- events ---------------- */
  function bind() {
    document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === b));
      document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + b.dataset.view));
      if (b.dataset.view === "explore" && map) setTimeout(() => map.invalidateSize(), 50);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));

    $("#langBtn").addEventListener("click", () => {
      S.lang = S.lang === "zh" ? "en" : "zh"; store.set("lang", S.lang);
      applyStatic(); renderPrefs(); renderCard(false); renderPlan(); renderShare();
      $("#parsed").innerHTML = t().parsedPrefix + describePrefs();
    });

    const runAsk = () => {
      const hits = applyParsed(parse($("#askText").value));
      const el = $("#parsed");
      el.innerHTML = hits ? t().parsedPrefix + describePrefs() : t().parsedNone;
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      refreshAll(true);
    };
    $("#askBtn").addEventListener("click", runAsk);
    $("#askText").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runAsk(); } });
    document.querySelectorAll(".ex").forEach((b) => b.addEventListener("click", () => { $("#askText").value = b.textContent; runAsk(); }));

    document.querySelector(".prefs").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      const P = S.prefs;
      if (c.dataset.time) P.minutes = +c.dataset.time;
      if (c.dataset.mode) P.mode = c.dataset.mode;
      if (c.dataset.int) {
        const k = c.dataset.int;
        P.interests = P.interests.includes(k) ? P.interests.filter((x) => x !== k) : P.interests.concat(k);
      }
      if (c.dataset.veg) P.veg = !P.veg;
      if (c.dataset.budget) P.budget = P.budget === +c.dataset.budget ? null : +c.dataset.budget;
      $("#parsed").innerHTML = t().parsedPrefix + describePrefs();
      refreshAll(true);
    });

    $("#nextBtn").addEventListener("click", () => {
      if (!S.deck.length) return;
      S.idx = S.idx >= S.deck.length ? 0 : S.idx + 1;
      renderCard(true);
    });
    $("#likeBtn").addEventListener("click", () => {
      const id = S.deck[S.idx]; if (!id) return;
      S.liked.has(id) ? S.liked.delete(id) : S.liked.add(id); store.set("liked", [...S.liked]); setActionState(byId(id));
    });
    $("#saveBtn").addEventListener("click", () => {
      const id = S.deck[S.idx]; if (!id) return;
      S.saved.has(id) ? S.saved.delete(id) : S.saved.add(id); store.set("saved", [...S.saved]); setActionState(byId(id));
    });
    $("#addBtn").addEventListener("click", () => {
      const id = S.deck[S.idx]; if (!id) return;
      if (S.plan.includes(id)) { S.plan = S.plan.filter((x) => x !== id); }
      else { S.plan = orderPlan(S.plan.concat(id)); toast(t().addedToast(nm(byId(id).name))); }
      renderPlan();
    });
    $("#autoBtn").addEventListener("click", () => {
      const p = autoPlan();
      if (!p.length) { toast(t().autoNone); return; }
      S.plan = p; renderPlan(); toast(t().autoToast(p.length));
    });
    $("#clearBtn").addEventListener("click", () => { S.plan = []; renderPlan(); });
    $("#timeline").addEventListener("click", (e) => {
      const sw = e.target.closest("[data-swap]"), rm = e.target.closest("[data-remove]");
      if (sw) swapStop(sw.dataset.swap);
      if (rm) { S.plan = orderPlan(S.plan.filter((x) => x !== rm.dataset.remove)); renderPlan(); }
    });
    document.querySelectorAll("[data-pass]").forEach((b) => b.addEventListener("click", () => { S.pass = b.dataset.pass; renderPass(); }));
    $("#planFab").addEventListener("click", () => $("#planSection").scrollIntoView({ behavior: "smooth" }));

    $("#shareForm").addEventListener("submit", submitShare);
    $("#fReason").addEventListener("input", (e) => { $("#reasonCount").textContent = e.target.value.length; });
    $("#shareList").addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"); if (!d) return;
      S.shares = S.shares.filter((s) => s.id !== d.dataset.del);
      S.plan = S.plan.filter((x) => x !== d.dataset.del);
      store.set("shares", S.shares); renderShare(); buildDeck(); renderCard(false); renderPlan();
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    applyStatic();
    bind();
    initMap();
    $("#askText").value = t().examples[0];
    applyParsed(parse(t().examples[0]));
    $("#parsed").innerHTML = t().parsedPrefix + describePrefs();
    refreshAll(false);
    renderShare();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
