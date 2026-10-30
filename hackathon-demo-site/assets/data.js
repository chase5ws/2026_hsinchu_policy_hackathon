/* 在地口袋嚮導 Demo — 示範資料
 * 地點為新竹火車站周邊舊城生活圈的真實地標，但：
 *  - 座標為概略值，步行時間由直線距離估算
 *  - 推薦人皆為「示範分享者」，非真實投稿
 *  - 營業時間、票價、套票內容一律以官方公告為準
 */
window.POCKET_DATA = {
  origin: {
    id: "station",
    name: { zh: "新竹火車站", en: "Hsinchu Station" },
    lat: 24.8016, lng: 120.9716
  },

  spots: [
    {
      id: "chenghuang-food",
      name: { zh: "城隍廟口小吃", en: "Chenghuang Temple Food Stalls" },
      cat: "food",
      tags: ["food", "local", "history"],
      lat: 24.8045, lng: 120.9655,
      stay: 35, cost: [100, 200],
      veg: "partial",
      emoji: "🍜",
      reason: {
        zh: "米粉、貢丸湯是新竹人的日常味道。廟口攤位多，一個人也能每樣點小份，兩小時行程最省時間的吃法。",
        en: "Rice noodles and pork-ball soup are everyday Hsinchu flavours. Many stalls in one spot, so you can try small portions of everything — the quickest way to eat well on a short trip."
      },
      tip: {
        zh: "假日中午人多，避開 12:00–13:00 會好找位子。部分攤位有素食潤餅可選。",
        en: "Busy at weekend lunch; avoid 12:00–13:00. Some stalls offer vegetarian spring rolls."
      },
      goodFor: { zh: "第一次來新竹、想一次吃多樣", en: "First-timers who want variety" },
      by: { zh: "阿凱", en: "Kai" }, visited: "2026/09"
    },
    {
      id: "chenghuang-temple",
      name: { zh: "新竹都城隍廟", en: "Hsinchu City God Temple" },
      cat: "history",
      tags: ["history", "local", "walk"],
      lat: 24.8043, lng: 120.9652,
      stay: 20, cost: [0, 0],
      veg: "na",
      emoji: "🏮",
      reason: {
        zh: "清代就有的城隍廟，屋頂剪黏和木雕很細。吃完廟口小吃順路進來看，不用另外繞路。",
        en: "A Qing-era temple with fine roof mosaics and wood carving. It sits right behind the food stalls, so no detour needed."
      },
      tip: { zh: "參拜請保持安靜，拍照避開正在祭拜的民眾。", en: "Keep quiet inside and avoid photographing worshippers." },
      goodFor: { zh: "喜歡建築、廟宇文化", en: "Architecture and temple-culture fans" },
      by: { zh: "阿凱", en: "Kai" }, visited: "2026/09"
    },
    {
      id: "east-gate",
      name: { zh: "東門城（迎曦門）", en: "East Gate (Yingxi Gate)" },
      cat: "history",
      tags: ["history", "walk", "photo"],
      lat: 24.8040, lng: 120.9688,
      stay: 15, cost: [0, 0],
      veg: "na",
      emoji: "🏯",
      reason: {
        zh: "竹塹城唯一留下來的城門，從車站走過來只要幾分鐘。傍晚燈光打起來很好拍。",
        en: "The only surviving gate of the old Zhuqian city wall, minutes from the station. Lovely lit up at dusk."
      },
      tip: { zh: "可走地下廣場繞到城門正面，不用穿越圓環車流。", en: "Use the sunken plaza to reach the front without crossing the roundabout." },
      goodFor: { zh: "時間很少、想打卡新竹地標", en: "Short on time, want the landmark" },
      by: { zh: "小芸", en: "Yun" }, visited: "2026/10"
    },
    {
      id: "moat-park",
      name: { zh: "護城河親水公園", en: "Moat Riverside Park" },
      cat: "walk",
      tags: ["walk", "nature", "relax"],
      lat: 24.8028, lng: 120.9700,
      stay: 25, cost: [0, 0],
      veg: "na",
      emoji: "🌿",
      reason: {
        zh: "沿著舊護城河的步道，有樹蔭和流水，飯後散步消化剛好，從東門城一路接到車站附近。",
        en: "A shaded path along the old moat with running water — an easy after-meal stroll that links East Gate back toward the station."
      },
      tip: { zh: "夏天午後偏熱，建議傍晚走。", en: "Hot on summer afternoons; evening is nicer." },
      goodFor: { zh: "想慢慢走、不想排行程太滿", en: "Slow walkers, relaxed pace" },
      by: { zh: "小芸", en: "Yun" }, visited: "2026/10"
    },
    {
      id: "dongmen-market",
      name: { zh: "東門市場", en: "Dongmen Market" },
      cat: "food",
      tags: ["food", "local", "cafe"],
      lat: 24.8034, lng: 120.9674,
      stay: 35, cost: [120, 300],
      veg: "yes",
      emoji: "🥢",
      reason: {
        zh: "老市場裡進駐不少年輕店家，傳統攤位和新式小店混在一起，想吃點不一樣的可以來逛。",
        en: "An old market where young vendors now sit beside traditional stalls — come here for something a little different."
      },
      tip: { zh: "部分店家只在特定時段營業，出發前先查最新資訊。", en: "Some shops keep limited hours; check before you go." },
      goodFor: { zh: "喜歡逛市場、找新奇小店", en: "Market browsers, new-food hunters" },
      by: { zh: "Jerry", en: "Jerry" }, visited: "2026/08"
    },
    {
      id: "image-museum",
      name: { zh: "新竹市影像博物館", en: "Hsinchu Image Museum" },
      cat: "art",
      tags: ["art", "history", "indoor"],
      lat: 24.8049, lng: 120.9678,
      stay: 30, cost: [0, 100],
      veg: "na",
      emoji: "🎞️",
      reason: {
        zh: "前身是日治時期的「有樂館」電影院，建築本身就值得看。下雨天的好去處。",
        en: "Housed in a Japanese-era cinema building that is worth seeing on its own. A good rainy-day stop."
      },
      tip: { zh: "開放時間與票價以官方公告為準，週一常休館。", en: "Hours and fees per official notice; often closed Mondays." },
      goodFor: { zh: "下雨天、喜歡電影與老建築", en: "Rainy days, film and old buildings" },
      by: { zh: "Jerry", en: "Jerry" }, visited: "2026/08"
    },
    {
      id: "art-museum",
      name: { zh: "新竹市美術館", en: "Hsinchu City Art Gallery" },
      cat: "art",
      tags: ["art", "indoor", "history"],
      lat: 24.8063, lng: 120.9707,
      stay: 30, cost: [0, 0],
      veg: "na",
      emoji: "🖼️",
      reason: {
        zh: "在日治時期的新竹市役所裡，展覽常換，規模不大，半小時就能看完，適合插在行程中間。",
        en: "Inside the former Japanese-era city hall. Exhibitions rotate and it's compact — 30 minutes is enough."
      },
      tip: { zh: "展期與開放時間請先查詢。", en: "Check current exhibitions and hours first." },
      goodFor: { zh: "喜歡看展、想躲太陽", en: "Gallery lovers, escaping the sun" },
      by: { zh: "小芸", en: "Yun" }, visited: "2026/10"
    },
    {
      id: "state-hall",
      name: { zh: "新竹州廳", en: "Former Hsinchu Prefecture Hall" },
      cat: "history",
      tags: ["history", "photo", "walk"],
      lat: 24.8068, lng: 120.9690,
      stay: 15, cost: [0, 0],
      veg: "na",
      emoji: "🏛️",
      reason: {
        zh: "紅磚日式官廳建築，現在是市政府，外觀就很好拍。順路經過停下來看看就好。",
        en: "A red-brick Japanese-era government building, now City Hall. Great façade — worth a short stop on the way."
      },
      tip: { zh: "上班時間為辦公場所，請在外觀拍照即可。", en: "It's a working office; photograph from outside." },
      goodFor: { zh: "建築迷、拍照", en: "Architecture and photos" },
      by: { zh: "阿凱", en: "Kai" }, visited: "2026/09"
    },
    {
      id: "beimen-street",
      name: { zh: "北門街老街", en: "Beimen Old Street" },
      cat: "walk",
      tags: ["walk", "history", "local", "photo"],
      lat: 24.8085, lng: 120.9651,
      stay: 25, cost: [0, 0],
      veg: "na",
      emoji: "🚶",
      reason: {
        zh: "新竹最老的街道之一，兩側還留著老店屋和中藥行，比觀光老街安靜，很有生活感。",
        en: "One of Hsinchu's oldest streets, still lined with shophouses and herbal stores — quieter and more lived-in than tourist old streets."
      },
      tip: { zh: "人行空間窄，注意機車。", en: "Narrow sidewalks; watch for scooters." },
      goodFor: { zh: "喜歡老街、不喜歡人擠人", en: "Old-street fans who dislike crowds" },
      by: { zh: "阿凱", en: "Kai" }, visited: "2026/09"
    },
    {
      id: "xinfuzhen",
      name: { zh: "新復珍竹塹餅", en: "Xin Fu Zhen Zhuqian Cake" },
      cat: "food",
      tags: ["food", "sweet", "souvenir", "local"],
      lat: 24.8081, lng: 120.9655,
      stay: 10, cost: [50, 400],
      veg: "partial",
      emoji: "🥮",
      reason: {
        zh: "百年餅舖，竹塹餅是新竹代表伴手禮。逛北門街順路買，帶回去送人很有話題。",
        en: "A century-old bakery; Zhuqian cake is Hsinchu's signature souvenir. Pick some up while walking Beimen Street."
      },
      tip: { zh: "傳統竹塹餅含豬油與肉餡，素食者請先詢問店家。", en: "Traditional versions contain lard and pork; vegetarians should ask." },
      goodFor: { zh: "要買伴手禮", en: "Souvenir shoppers" },
      by: { zh: "Jerry", en: "Jerry" }, visited: "2026/08"
    },
    {
      id: "changhe-temple",
      name: { zh: "長和宮", en: "Changhe Temple" },
      cat: "history",
      tags: ["history", "local"],
      lat: 24.8097, lng: 120.9645,
      stay: 15, cost: [0, 0],
      veg: "na",
      emoji: "⛩️",
      reason: {
        zh: "北門街尾的媽祖廟，早年是商人祈求航海平安的地方，從這裡能看出新竹港口貿易的歷史。",
        en: "A Mazu temple at the end of Beimen Street where merchants once prayed for safe voyages — a window into Hsinchu's trading past."
      },
      tip: { zh: "可與北門街排在同一段步行。", en: "Pair it with Beimen Street on one walk." },
      goodFor: { zh: "對地方歷史有興趣", en: "Local-history curious" },
      by: { zh: "阿凱", en: "Kai" }, visited: "2026/09"
    },
    {
      id: "hsinchu-park",
      name: { zh: "新竹公園・玻璃工藝博物館", en: "Hsinchu Park & Glass Museum" },
      cat: "walk",
      tags: ["walk", "nature", "art", "relax"],
      lat: 24.8010, lng: 120.9783,
      stay: 40, cost: [0, 100],
      veg: "na",
      emoji: "🫧",
      reason: {
        zh: "在車站另一側，有湖、大樹和玻璃工藝博物館。想離開市區車流、安靜走一走就往這邊。",
        en: "On the other side of the station: a lake, big trees and the Glass Museum. Head here to escape traffic for a quiet walk."
      },
      tip: { zh: "從車站後站方向過去較近。博物館開放時間以官方公告為準。", en: "Closer via the station's rear exit. Museum hours per official notice." },
      goodFor: { zh: "親子、想安靜散步", en: "Families, quiet walks" },
      by: { zh: "小芸", en: "Yun" }, visited: "2026/10"
    },
    {
      id: "zhulian-temple",
      name: { zh: "竹蓮寺", en: "Zhulian Temple" },
      cat: "history",
      tags: ["history", "local", "food"],
      lat: 24.7962, lng: 120.9688,
      stay: 20, cost: [0, 150],
      veg: "na",
      emoji: "🪷",
      reason: {
        zh: "在地人拜觀音的老廟，周邊巷子有不少老字號小吃，比城隍廟口少觀光客。",
        en: "A Guanyin temple locals actually use; the lanes around it hide long-running snack shops with fewer tourists than Chenghuang."
      },
      tip: { zh: "從車站往南走約十多分鐘，可回程順路。", en: "About 10+ minutes south of the station." },
      goodFor: { zh: "想看在地人日常", en: "Seeing everyday local life" },
      by: { zh: "Jerry", en: "Jerry" }, visited: "2026/08"
    },
    {
      id: "station-building",
      name: { zh: "新竹車站站體", en: "Hsinchu Station Building" },
      cat: "history",
      tags: ["history", "photo"],
      lat: 24.8018, lng: 120.9714,
      stay: 10, cost: [0, 0],
      veg: "na",
      emoji: "🚉",
      reason: {
        zh: "1913 年完工、仍在使用的車站建築，出發或回程時抬頭看一下巴洛克風的立面和鐘塔。",
        en: "Completed in 1913 and still in use. Look up at the Baroque façade and clock tower as you arrive or leave."
      },
      tip: { zh: "站前廣場是拍全景的好位置。", en: "The front plaza gives the best full view." },
      goodFor: { zh: "剛下車、時間很趕", en: "Just arrived, very short on time" },
      by: { zh: "小芸", en: "Yun" }, visited: "2026/10"
    }
  ],

  pass: {
    url: "https://hsinchupass.startravel.com.tw/",
    name: { zh: "新竹風 PASS", en: "Hsinchu Wind PASS" }
  },

  sources: [
    { zh: "觀光署《114 年臺灣旅遊狀況調查》摘要（2026.08.03 公布）", en: "Tourism Administration, 2025 Taiwan Travel Survey summary (published 2026-08-03)", url: "https://www.motc.gov.tw/ch/app/data/view?id=14&module=news&serno=96139457-a19b-4527-91af-41650751505a" },
    { zh: "內政部 115 年第 18 週統計通報", en: "Ministry of the Interior statistical bulletin, 2026 week 18", url: "https://www.moi.gov.tw/news_content.aspx?n=9&s=338189&sms=9009" },
    { zh: "新竹風 PASS 官方網站", en: "Hsinchu Wind PASS official site", url: "https://hsinchupass.startravel.com.tw/" },
    { zh: "TDX 運輸資料流通服務（後續交通資料候選）", en: "TDX Transport Data eXchange (candidate transit data)", url: "https://tdx.transportdata.tw/data-service/basic" }
  ]
};
