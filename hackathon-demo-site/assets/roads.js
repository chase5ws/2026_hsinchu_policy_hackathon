/* 竹路通 Demo — 前端邏輯（無後端）
 * AI 分類以關鍵字規則模擬；正式版改用 LLM 並串接事故、TDX、1999 資料。
 */
(function () {
  "use strict";
  const D = window.ROAD_DATA;
  const CATS = D.categories;
  const $ = (q) => document.querySelector(q);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- storage ---------- */
  const KEY = "rd_state_v1";
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  const S = {
    created: saved.created || [],
    plus: saved.plus || {},
    invited: saved.invited || [],
    subs: saved.subs || [],
    filter: "all", sort: "score", sel: null,
    picking: false, loc: null, role: "外送員", photo: null
  };
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ created: S.created, plus: S.plus, invited: S.invited, subs: S.subs })); } catch (e) { /* ignore */ }
  }

  /* ---------- helpers ---------- */
  function issues() {
    return D.issues.concat(S.created).map((i) => Object.assign({}, i, {
      reports: i.reports + (S.plus[i.id] || 0),
      council: S.invited.includes(i.id) && i.council === "未邀請" ? "邀請中" : i.council
    }));
  }
  const byId = (id) => issues().find((i) => i.id === id);
  function meters(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function scoreParts(i) {
    return [
      ["回報人數", Math.min(30, Math.round(i.reports * 0.8)), 30],
      ["附近事故", Math.min(30, i.accidents * 6), 30],
      ["嚴重程度", i.sev * 7, 21],
      ["道路等級", i.road * 3, 9],
      ["等待天數", Math.min(10, Math.round(i.days * 0.25)), 10]
    ];
  }
  const score = (i) => Math.min(100, scoreParts(i).reduce((a, p) => a + p[1], 0));
  const district = (i) => (i.place.match(/^(東區|北區|香山區)/) || [])[1] || "";
  let toastT;
  function toast(m) { const el = $("#toast"); el.textContent = m; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2800); }

  /* ---------- AI classification (rule-based demo) ---------- */
  const RULES = [
    ["park", /園區|竹科管理局|科學園區/],
    ["pothole", /坑|洞|破損|龜裂|凹|不平|鋪面|柏油/],
    ["signal", /號誌|紅綠燈|綠燈|紅燈|秒數|標線|待轉|斑馬線|標誌/],
    ["jam", /塞|回堵|壅|車多|卡住|動線|逆向/],
    ["light", /路燈|很暗|太暗|不亮|照明/],
    ["flood", /積水|淹|排水|水溝/],
    ["parking", /違停|亂停|佔用|占用|停滿/],
    ["sidewalk", /人行道|騎樓|樹根|行人|輪椅|嬰兒車/]
  ];
  function classify(text) {
    let cat = "pothole", hit = false;
    for (const [c, re] of RULES) { if (re.test(text)) { cat = c; hit = true; break; } }
    let sev = 1;
    if (/危險|摔|跌倒|車禍|撞|受傷|差點|小孩|學童|老人|長輩/.test(text)) sev = 3;
    else if (/晚上|夜間|下雨|雨天|尖峰|每天/.test(text)) sev = 2;
    return { cat, sev, hit };
  }
  function nearbySame(loc, cat) {
    let best = null;
    issues().forEach((i) => {
      if (i.cat !== cat || i.stage >= 5) return;
      const d = meters(loc, i);
      if (d <= 200 && (!best || d < best.d)) best = { i, d };
    });
    return best;
  }

  /* ---------- KPIs ---------- */
  function renderKpis() {
    const all = issues();
    const done = all.filter((i) => i.stage >= 5);
    const avg = done.length ? Math.round(done.reduce((a, i) => a + i.days, 0) / done.length) : 0;
    const k = [
      [all.length, "公開議題"],
      [all.reduce((a, i) => a + i.reports, 0), "累積回報"],
      [all.filter((i) => i.stage >= 2).length, "已轉主管機關"],
      [done.length, "已完工"],
      [avg + " 天", "平均改善天數"]
    ];
    $("#kpis").innerHTML = k.map(([v, l]) => `<div class="kpi"><b>${v}</b><span>${l}（示範）</span></div>`).join("");
  }

  /* ---------- filters & list ---------- */
  function renderFilters() {
    const btns = [["all", "全部"]].concat(Object.keys(CATS).map((k) => [k, CATS[k].icon + " " + CATS[k].label]));
    $("#filters").innerHTML = btns.map(([k, l]) => `<button class="chip${S.filter === k ? " on" : ""}" data-f="${k}">${esc(l)}</button>`).join("");
  }
  function visible() {
    let list = issues().filter((i) => S.filter === "all" || i.cat === S.filter);
    if (S.sort === "score") list.sort((a, b) => score(b) - score(a));
    if (S.sort === "reports") list.sort((a, b) => b.reports - a.reports);
    if (S.sort === "new") list.sort((a, b) => a.days - b.days);
    return list;
  }
  function stageBadge(i) {
    const n = D.stages[i.stage];
    return `<span class="badge${i.stage >= 5 ? " done" : ""}">${esc(n)}</span>`;
  }
  function renderList() {
    const list = visible();
    $("#issueList").innerHTML = list.map((i) => {
      const sc = score(i);
      return `<li class="issue${S.sel === i.id ? " sel" : ""}" data-id="${i.id}" tabindex="0">
        <div class="score ${sc >= 70 ? "hi" : sc >= 45 ? "mid" : ""}">${sc}</div>
        <div><div class="issue-t">${CATS[i.cat].icon} ${esc(i.title)}</div>
          <div class="issue-m">${esc(i.place)} · ${i.reports} 人回報${i.mine ? ' · <span class="badge mine">我的回報</span>' : ""}</div></div>
        ${stageBadge(i)}
      </li>`;
    }).join("") || `<li class="muted">此類型目前沒有議題</li>`;
  }

  /* ---------- map ---------- */
  let map = null, layer = null, pickMarker = null;
  function initMap() {
    if (!window.L) { $("#rmap").innerHTML = `<div class="map-fallback">地圖載入失敗（可能離線），清單與回報功能仍可使用。</div>`; return; }
    try {
      map = L.map("rmap", { scrollWheelZoom: false }).setView(D.center, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      layer = L.layerGroup().addTo(map);
      map.on("click", (e) => {
        if (!S.picking) return;
        setLoc({ lat: e.latlng.lat, lng: e.latlng.lng, label: `地圖選點（${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}）` });
        togglePick(false);
        $("#report-sec").scrollIntoView({ behavior: "smooth" });
      });
    } catch (e) { map = null; }
  }
  function drawMap() {
    if (!map) return;
    layer.clearLayers();
    visible().forEach((i) => {
      const c = CATS[i.cat].color, done = i.stage >= 5;
      L.circleMarker([i.lat, i.lng], {
        radius: 6 + Math.sqrt(i.reports) * 1.8, color: done ? "#1a7f4b" : (S.sel === i.id ? "#1f2328" : "#fff"),
        weight: done || S.sel === i.id ? 3 : 2, fillColor: c, fillOpacity: done ? 0.35 : 0.85
      }).bindTooltip(`${CATS[i.cat].icon} ${i.title}（${i.reports} 人）`).on("click", () => select(i.id, true)).addTo(layer);
    });
  }

  /* ---------- detail ---------- */
  function select(id, scroll) {
    S.sel = id; renderList(); drawMap(); renderDetail();
    if (scroll) $("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
    const i = byId(id); if (map && i) map.panTo([i.lat, i.lng]);
  }
  function renderDetail() {
    const i = byId(S.sel); const el = $("#detail");
    if (!i) { el.innerHTML = `<p class="muted">在地圖或排行點選一個議題查看詳情。</p>`; return; }
    const cat = CATS[i.cat], sc = score(i);
    const plused = !!S.plus[i.id], subbed = S.subs.includes(i.id);
    const inviteDisabled = i.council !== "未邀請";
    const parts = scoreParts(i);
    const stages = D.stages.map((n, k) => `<li class="stg ${k < i.stage ? "done" : k === i.stage ? "now" : ""}"><span class="dot">${k < i.stage ? "✓" : k + 1}</span><span class="s-name">${esc(n)}</span></li>`).join("");
    el.innerHTML = `
      <div class="detail-top">
        <div>
          <div class="d-meta">${esc(i.id)} · ${cat.icon} ${esc(cat.label)} · ${esc(i.place)}</div>
          <h2>${esc(i.title)}</h2>
          <div class="d-meta">${i.reports} 人回報 · 建議主管機關：<b>${esc(i.agency || cat.agency)}</b> · 議員場勘：${esc(i.council)}</div>
        </div>
        <div class="d-actions">
          <button class="btn ${plused ? "dark" : "primary"}" data-act="plus">${plused ? "✓ 已附議" : "🙋 我也遇到"}</button>
          <button class="btn ghost" data-act="invite" ${inviteDisabled ? "disabled" : ""}>📣 ${inviteDisabled ? esc(i.council) : "邀請議員場勘"}</button>
          <button class="btn ghost" data-act="sub">${subbed ? "🔔 已訂閱通知" : "🔕 訂閱進度通知"}</button>
        </div>
      </div>
      <div>
        <div class="photo-ph">${i.photo ? `<img src="${i.photo}" alt="回報照片">` : cat.icon}</div>
        <div class="ai-sum"><b>🤖 AI 摘要</b>${esc(i.summary)}</div>
        <h3>公開數據佐證</h3>
        <ul class="evid">
          <li><span>🚑</span><span>回報點 150 公尺內近一年事故：<b>${i.accidents} 筆</b>（交通部 A1／A2 事故資料${i.mine ? "，Demo 未連線查詢" : "，示範值"}）</span></li>
          <li><span>📡</span><span>TDX 路況：${esc(i.tdx || "—")}</span></li>
          <li><span>☎️</span><span>1999／新竹通相似陳情：${i.similar1999 || 0} 件（需市府介接，示範值）</span></li>
          <li><span>👥</span><span>回報者：外送員、通勤族、在地居民（示範）</span></li>
        </ul>
        ${i.basedOn ? `<div class="based">ℹ️ ${esc(i.basedOn)}，內容為示意。</div>` : ""}
      </div>
      <div>
        <h3 style="margin-top:0">優先分數 ${sc} / 100</h3>
        <div class="breakdown">${parts.map(([n, v, m]) => `<div class="bk"><span>${n}</span><span class="bar"><i style="width:${Math.round(v / m * 100)}%"></i></span><span>${v}</span></div>`).join("")}</div>
        <h3>處理進度（公開）</h3>
        <ol class="stages">${stages}</ol>
        <ul class="log">${(i.log || []).map(([d, t]) => `<li><b>${esc(d)}</b>${esc(t)}</li>`).join("")}</ul>
        ${i.stage >= 3 ? `<div class="video"><span class="play">▶</span><span>場勘影片與會議紀錄（示範）<br><span class="small">公開議員、主管機關的承諾與預計完成日</span></span></div>` : ""}
      </div>`;
  }
  function onDetailClick(e) {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const i = byId(S.sel); if (!i) return;
    const act = b.dataset.act;
    if (act === "plus") {
      if (S.plus[i.id]) { delete S.plus[i.id]; toast("已取消附議"); }
      else { S.plus[i.id] = 1; toast(`已附議，目前 ${i.reports + 1} 人遇到相同問題`); }
    }
    if (act === "invite") {
      S.invited.push(i.id);
      toast(`已向${district(i) || "該選區"}所有議員發出公開場勘邀請（示範）`);
    }
    if (act === "sub") {
      if (S.subs.includes(i.id)) S.subs = S.subs.filter((x) => x !== i.id);
      else { S.subs.push(i.id); toast("進度有變更時會用 LINE 通知你（示範）"); }
    }
    persist(); renderAll();
  }

  /* ---------- report form ---------- */
  const PRESETS = [
    ["東區 光復路一段 525 巷口", 24.7907, 120.9978],
    ["北區 東大路二段", 24.8155, 120.9745],
    ["東區 食品路 × 學府路", 24.7934, 120.9881],
    ["東區 民族路", 24.8061, 120.9762],
    ["東區 新竹火車站前 中正路", 24.8023, 120.9703],
    ["北區 經國路一段", 24.8122, 120.9639],
    ["東區 公道五路二段", 24.7998, 120.9902],
    ["香山區 中華路六段", 24.7742, 120.9338]
  ];
  function setLoc(loc) {
    S.loc = loc;
    $("#locTxt").textContent = "📍 " + loc.label;
    if (map) {
      if (pickMarker) pickMarker.remove();
      pickMarker = L.marker([loc.lat, loc.lng]).addTo(map).bindTooltip("你的回報位置");
    }
  }
  function togglePick(on) {
    S.picking = on;
    $("#rmap").classList.toggle("picking", on);
    $("#pickBtn").textContent = on ? "✕ 取消選點" : "📍 在地圖上點選";
    if (on) { $("#map-sec").scrollIntoView({ behavior: "smooth" }); toast("請在地圖上點一下問題位置"); }
  }
  function aiPreview(showErrors) {
    const text = $("#rDesc").value.trim();
    const err = $("#rErr");
    if (!text) { if (showErrors) err.textContent = "請描述發生什麼事"; return null; }
    err.textContent = "";
    const r = classify(text);
    const cat = CATS[r.cat];
    const dup = S.loc ? nearbySame(S.loc, r.cat) : null;
    $("#aiBox").hidden = false;
    $("#aiBox").innerHTML = `<b>🤖 AI 分類預覽</b>
      <ul>
        <li>類型：${cat.icon} ${esc(cat.label)}${r.hit ? "" : "（關鍵字不明確，預設歸類，可由審核人員修正）"}</li>
        <li>嚴重程度：${["", "一般", "中", "高"][r.sev]}</li>
        <li>建議主管機關：${esc(cat.agency)}（示範，實際依市府分工）</li>
        <li>${S.loc ? (dup ? `附近 ${Math.round(dup.d)} 公尺已有相同問題「${esc(dup.i.title)}」，將合併並附議` : "附近沒有相同議題，將建立新議題") : "選好位置後會檢查附近是否已有相同回報"}</li>
      </ul>`;
    return r;
  }
  function chat(html, who, cls) {
    const c = $("#chat");
    const d = document.createElement("div");
    d.className = "bub " + who + (cls ? " " + cls : "");
    d.innerHTML = html;
    c.appendChild(d); c.scrollTop = c.scrollHeight;
  }
  function submit(e) {
    e.preventDefault();
    const err = $("#rErr");
    if (!S.loc) { err.textContent = "請先選擇位置"; return; }
    const r = aiPreview(true); if (!r) return;
    const text = $("#rDesc").value.trim();
    const cat = CATS[r.cat];
    const dup = nearbySame(S.loc, r.cat);
    let issueId;

    if (S.photo) chat(`<img src="${S.photo}" alt="">`, "me", "img");
    chat(`📍 ${esc(S.loc.label)}`, "me");
    chat(esc(text), "me");

    if (dup) {
      issueId = dup.i.id;
      S.plus[issueId] = (S.plus[issueId] || 0) + 1;
      chat(`收到，謝謝你！\nAI 判斷：${cat.icon} ${esc(cat.label)}\n附近 ${Math.round(dup.d)} 公尺已有 ${dup.i.reports} 人回報相同問題，已幫你合併並附議。\n目前進度：${esc(D.stages[dup.i.stage])}<span class="lnk">查看議題 ${esc(issueId)} ›</span>`, "bot");
    } else {
      issueId = "HC-" + (500 + S.created.length + 1);
      S.created.push({
        id: issueId, cat: r.cat, sev: r.sev, road: 2,
        title: text.length > 26 ? text.slice(0, 26) + "…" : text,
        place: S.loc.label, lat: S.loc.lat, lng: S.loc.lng,
        reports: 1, accidents: 0, tdx: "Demo 未連線，正式版即時比對", similar1999: 0,
        stage: 1, days: 0, summary: text, photo: S.photo, mine: true, agency: cat.agency,
        log: [[new Date().toLocaleDateString("zh-TW"), "首則回報（你）"], [new Date().toLocaleDateString("zh-TW"), "AI 分類完成，等待更多附議與數據比對"]],
        council: "未邀請"
      });
      chat(`收到，謝謝你！\nAI 判斷：${cat.icon} ${esc(cat.label)}，嚴重程度「${["", "一般", "中", "高"][r.sev]}」\n已建立公開議題 ${esc(issueId)}，建議轉${esc(cat.agency)}。\n附近的人按「我也遇到」越多，優先分數越高。<span class="lnk">查看議題 ${esc(issueId)} ›</span>`, "bot");
    }
    if (!S.subs.includes(issueId)) S.subs.push(issueId);
    setTimeout(() => chat("🔔 已幫你訂閱進度通知。主管機關回覆、議員場勘、完工時都會告訴你。", "bot"), 500);

    persist();
    $("#rForm").reset(); $("#aiBox").hidden = true; $("#photoPrev").hidden = true; $("#photoTxt").hidden = false;
    S.photo = null; S.loc = null; $("#locTxt").textContent = "尚未選擇位置";
    if (pickMarker) { pickMarker.remove(); pickMarker = null; }
    renderRoles();
    S.filter = "all"; renderAll(); select(issueId, false);
    toast(dup ? "已合併到既有議題" : "已建立新議題");
  }
  function renderRoles() {
    $("#roleChips").innerHTML = ["外送員", "通勤族", "在地居民", "其他"].map((r) => `<button type="button" class="chip${S.role === r ? " on" : ""}" data-role="${r}">${r}</button>`).join("");
  }

  /* ---------- bind ---------- */
  function renderAll() { renderKpis(); renderFilters(); renderList(); drawMap(); renderDetail(); }
  function bind() {
    $("#filters").addEventListener("click", (e) => { const c = e.target.closest("[data-f]"); if (!c) return; S.filter = c.dataset.f; renderAll(); });
    $("#sortSel").addEventListener("change", (e) => { S.sort = e.target.value; renderList(); });
    $("#issueList").addEventListener("click", (e) => { const li = e.target.closest("[data-id]"); if (li) select(li.dataset.id, true); });
    $("#issueList").addEventListener("keydown", (e) => { if (e.key === "Enter") { const li = e.target.closest("[data-id]"); if (li) select(li.dataset.id, true); } });
    $("#detail").addEventListener("click", onDetailClick);
    $("#pickBtn").addEventListener("click", () => togglePick(!S.picking));
    const sel = $("#presetLoc");
    sel.innerHTML += PRESETS.map((p, k) => `<option value="${k}">${p[0]}</option>`).join("");
    sel.addEventListener("change", () => { const p = PRESETS[+sel.value]; if (p) setLoc({ label: p[0], lat: p[1], lng: p[2] }); if (!$("#aiBox").hidden) aiPreview(false); });
    $("#rPhoto").addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        // 縮圖後再存，避免 localStorage 爆量
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas"), w = 480, h = Math.round(img.height * w / img.width);
          c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h);
          S.photo = c.toDataURL("image/jpeg", 0.7);
          $("#photoPrev").src = S.photo; $("#photoPrev").hidden = false; $("#photoTxt").hidden = true;
        };
        img.src = rd.result;
      };
      rd.readAsDataURL(f);
    });
    $("#aiBtn").addEventListener("click", () => aiPreview(true));
    document.querySelectorAll(".ex").forEach((b) => b.addEventListener("click", () => {
      $("#rDesc").value = b.textContent;
      const guess = PRESETS.find((p) => b.textContent.includes(p[0].replace(/^(東區|北區|香山區) /, "").split(" ")[0]));
      if (guess && !S.loc) setLoc({ label: guess[0], lat: guess[1], lng: guess[2] });
      aiPreview(false);
    }));
    $("#roleChips").addEventListener("click", (e) => { const c = e.target.closest("[data-role]"); if (!c) return; S.role = c.dataset.role; renderRoles(); });
    $("#rForm").addEventListener("submit", submit);
    $("#srcList").innerHTML = D.dataSources.map((s) => `<li><b>${esc(s.name)}</b>：${esc(s.use)}</li>`).join("");
  }

  function boot() {
    initMap(); bind(); renderRoles();
    chat("嗨！我是竹路通 🚧\n傳照片和位置，說說遇到什麼路況問題。我會幫你歸類、找有沒有人回報過，並公開追蹤到改善為止。", "bot");
    S.sel = visible().sort((a, b) => score(b) - score(a))[0].id;
    renderAll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
