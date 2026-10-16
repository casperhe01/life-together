// 生命同行营 / Life Together：读取 prayers.js 中的 window.PRAYERS，显示月历与当日灵修（中 / EN）。
(function () {
  const all = window.PRAYERS || [];
  const cfg = Object.assign({ isAllContentDisplayed: 1, publishTime: "19:00", timeZone: "" }, window.CONFIG || {});
  const showAll = Number(cfg.isAllContentDisplayed) === 1;
  const [pubH, pubM] = String(cfg.publishTime).split(":").map(Number);
  const publishMin = (pubH || 0) * 60 + (pubM || 0);
  // 发布时间的显示文字，例如 "22:00" → 中文 "10:00pm"、英文 "10:00 pm"
  const mm = String(pubM || 0).padStart(2, "0");
  const h12 = (pubH % 12) || 12, ap = pubH < 12 ? "am" : "pm";
  const publishLabel = { zh: `${h12}:${mm}${ap}`, en: `${h12}:${mm} ${ap}` };
  // 各期开始的日期（以后有新的一期，在这里加一行）。日历上看到的日期属于哪一期，标题就显示哪一期
  const SESSIONS = [
    { start: "2026-02-02", zh: "第一期", en: "Session 1" },
    { start: "2026-09-01", zh: "第二期", en: "Session 2" },
  ];

  // 当前日期与时间（按 cfg.timeZone；为空则用读者设备的本地时间）
  function now() {
    const d = new Date();
    if (cfg.timeZone) {
      try {
        const p = {};
        new Intl.DateTimeFormat("en-CA", { timeZone: cfg.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d).forEach(x => { p[x.type] = x.value; });
        return { iso: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) };
      } catch (e) {}
    }
    return { iso: iso(d), min: d.getHours() * 60 + d.getMinutes() };
  }
  // 当日内容是否已发布：日期早于今天，或是今天且已过发布时间
  function released(date, n) { return showAll || date < n.iso || (date === n.iso && n.min >= publishMin); }

  let byDate, dates, todayIso, pendingToday, stamp;
  function refreshVisible() {
    const n = now();
    const data = all.filter(d => released(d.date, n));
    byDate = new Map(data.map(d => [d.date, d]));
    dates = data.map(d => d.date).sort();
    todayIso = n.iso;
    pendingToday = !showAll && !byDate.has(todayIso) && all.some(d => d.date === todayIso);
    const old = stamp;
    stamp = `${todayIso}|${dates.length}`;
    return old !== undefined && old !== stamp;
  }

  const T = {
    zh: {
      brand: "生命同行营", sub: "每日读经 · 祷告", review: "回顾一期",
      today: "回到今天", prevM: "上个月", nextM: "下个月", legend: "已有灵修内容", legendPub: t => `（当日内容 ${t} 自动发布）`,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      wd: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      month: (y, m) => `${y} 年 ${m} 月`, day: (y, m, d) => `${y} 年 ${m} 月 ${d} 日`,
      interp: "经文解读", prayer: "今日祷告", prev: "‹ 前一篇", next: "后一篇 ›",
      emptyT: "本日内容尚未生成", emptyS: "有内容的日期在日历上带有小圆点", none: "暂无内容",
      pendT: "今日内容即将发布", pendS: t => `今日的灵修将于 ${t} 自动发布`,
      acts: [["adoration", "A", "Adoration", "赞美"], ["confession", "C", "Confession", "认罪"],
             ["thanksgiving", "T", "Thanksgiving", "感谢"], ["supplication", "S", "Supplication", "祈求"]],
      foot: "经文：和合本（公有领域版本；新译本仅提供外部链接）　·　解读参考：《圣经综合解读》cmcbiblereading.com"
    },
    en: {
      brand: "Life Together", sub: "Daily Scripture · Prayer", review: "Session 1",
      today: "Today", prevM: "Previous month", nextM: "Next month", legend: "Devotion available", legendPub: t => ` (today's devotion posts automatically at ${t})`,
      week: ["S", "M", "T", "W", "T", "F", "S"],
      wd: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      month: (y, m) => `${["January","February","March","April","May","June","July","August","September","October","November","December"][m - 1]} ${y}`,
      day: (y, m, d) => `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1]} ${d}, ${y}`,
      interp: "Reflection", prayer: "Today's Prayer", prev: "‹ Previous", next: "Next ›",
      emptyT: "No devotion for this day yet", emptyS: "Days with a devotion are marked with a dot", none: "no devotion yet",
      pendT: "Today's devotion is coming soon", pendS: t => `Today's devotion will be posted automatically at ${t}`,
      acts: [["adoration", "A", "Adoration", ""], ["confession", "C", "Confession", ""],
             ["thanksgiving", "T", "Thanksgiving", ""], ["supplication", "S", "Supplication", ""]],
      foot: "Scripture: Berean Standard Bible (BSB), public domain; NIV is an external link only　·　Reflections drawn from cmcbiblereading.com"
    }
  };

  let lang = "zh";
  try { const s = localStorage.getItem("lt-lang"); if (s === "en" || s === "zh") lang = s; } catch (e) {}

  const pad = n => String(n).padStart(2, "0");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = id => document.getElementById(id);

  refreshVisible();
  function defaultDate() {
    if (byDate.has(todayIso) || !dates.length) return todayIso;
    return dates.reduce((a, b) => Math.abs(parse(b) - parse(todayIso)) < Math.abs(parse(a) - parse(todayIso)) ? b : a);
  }
  let selected = defaultDate();
  let view = parse(selected); view.setDate(1);

  // 取当前语言的内容；英文缺失时回退到中文
  const content = item => (lang === "en" && item.en) ? item.en : item;
  // BibleGateway 外链（只链接，不复制经文）：NIV（英文）、新译本简体版 CNVS（中文）。都用英文经文出处搜索
  const bgUrl = (ref, ver) => "https://www.biblegateway.com/passage/?search=" + encodeURIComponent(ref.replace(/–/g, "-")) + "&version=" + ver;
  const nivUrl = ref => bgUrl(ref, "NIV");
  const cnvUrl = item => bgUrl((item.en && item.en.ref) || item.ref, "CNVS");

  function renderChrome() {
    const t = T[lang];
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.body.classList.toggle("is-en", lang === "en");
    $("brand-name").textContent = t.brand;
    $("brand-sub").textContent = t.sub;
    $("btn-today").textContent = t.today;
    $("btn-review").textContent = t.review;
    $("btn-prev-month").setAttribute("aria-label", t.prevM);
    $("btn-next-month").setAttribute("aria-label", t.nextM);
    $("legend").textContent = t.legend + (showAll ? "" : t.legendPub(publishLabel[lang]));
    $("foot").textContent = t.foot;
    $("cal-week").innerHTML = t.week.map(w => `<span>${w}</span>`).join("");
    ["zh", "en"].forEach(l => $("lang-" + l).setAttribute("aria-pressed", String(l === lang)));
  }

  // 标题旁的「第几期」：日历当前月份里选中的日期；没选中则看这个月的最后一天
  function renderSession() {
    const inView = selected && parse(selected).getFullYear() === view.getFullYear() && parse(selected).getMonth() === view.getMonth();
    const key = inView ? selected : iso(new Date(view.getFullYear(), view.getMonth() + 1, 0));
    const s = SESSIONS.filter(x => x.start <= key).pop() || SESSIONS[0];
    $("brand-session").textContent = s[lang];
  }

  function renderCalendar() {
    const t = T[lang];
    renderSession();
    $("month-label").textContent = t.month(view.getFullYear(), view.getMonth() + 1);
    const lead = new Date(view.getFullYear(), view.getMonth(), 1).getDay();   // 周日为一周第一天
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < lead; i++) html += `<span class="day blank"></span>`;
    for (let d = 1; d <= days; d++) {
      const key = iso(new Date(view.getFullYear(), view.getMonth(), d));
      const item = byDate.get(key);
      const cls = ["day", item && "has", key === todayIso && "today", key === selected && "selected"].filter(Boolean).join(" ");
      const label = item ? `${key}, ${content(item).ref}` : `${key}, ${t.none}`;
      html += `<button type="button" class="${cls}" data-date="${key}" aria-label="${esc(label)}" aria-pressed="${key === selected}">${d}</button>`;
    }
    $("cal-days").innerHTML = html;
  }

  function renderReading() {
    const t = T[lang];
    const d = parse(selected);
    const head = t.day(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const item = byDate.get(selected);
    const i = dates.indexOf(selected);
    const prev = item ? dates[i - 1] : dates.filter(x => x < selected).pop();
    const next = item ? dates[i + 1] : dates.find(x => x > selected);
    const pager = `<nav class="pager">
        <button type="button" data-go="${prev || ""}" ${prev ? "" : "disabled"}>${t.prev}</button>
        <button type="button" data-go="${next || ""}" ${next ? "" : "disabled"}>${t.next}</button>
      </nav>`;
    const dateRow = `<div class="r-date"><span>${head}</span><span>${t.wd[d.getDay()]}</span></div>`;

    if (!item) {
      const pend = pendingToday && selected === todayIso;
      const msg = pend
        ? `<strong>${t.pendT}</strong><span>${t.pendS(publishLabel[lang])}</span><span>${t.emptyS}</span>`
        : `<strong>${t.emptyT}</strong><span>${t.emptyS}</span>`;
      $("reading").innerHTML = `${dateRow}<div class="empty">${msg}</div>${pager}`;
      return;
    }
    const c = content(item);
    const verses = c.verses.map(v => `<sup>${v.v}</sup>${esc(v.t)}`).join(lang === "en" ? " " : "");
    const acts = t.acts.map(([k, letter, full, zh]) =>
      `<p><b><em>${letter}</em><i>${full}</i>${zh}</b><span>${esc(c.prayer[k])}</span></p>`).join("");
    const refLine = lang === "en"
      ? `<p class="r-ref">${esc(c.ref)} <span class="ver">BSB</span><a class="niv" href="${nivUrl(c.ref)}" target="_blank" rel="noopener">Read in NIV ↗</a></p>`
      : `<p class="r-ref">${esc(c.ref)} <span class="ver">和合本</span><a class="niv" href="${cnvUrl(item)}" target="_blank" rel="noopener">阅读新译本 ↗</a></p>`;
    $("reading").innerHTML = `
      <header>${dateRow}<h1 class="r-title">${esc(c.title)}</h1>${refLine}</header>
      <blockquote class="scripture">${verses}</blockquote>
      <section><h3 class="section-label">${t.interp}</h3><p class="interp">${esc(c.interpretation)}</p></section>
      <section><h3 class="section-label">${t.prayer}</h3>
        <div class="acts">${acts}<p class="closing">${esc(c.closing)}</p></div>
      </section>
      ${pager}`;
  }

  function renderAll() { renderChrome(); renderCalendar(); renderReading(); }

  function select(key) {
    if (!key) return;
    selected = key;
    const d = parse(key);
    view = new Date(d.getFullYear(), d.getMonth(), 1);
    renderCalendar(); renderReading();
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lt-lang", l); } catch (e) {}
    renderAll();
  }

  $("cal-days").addEventListener("click", e => { const b = e.target.closest("[data-date]"); if (b) select(b.dataset.date); });
  $("reading").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b && b.dataset.go) select(b.dataset.go); });
  // 切换月份；dir = -1 上个月，1 下个月。带一个轻微的滑入动画
  function shiftMonth(dir) {
    view.setMonth(view.getMonth() + dir);
    renderCalendar();
    const grid = $("cal-days");
    grid.classList.remove("slide-next", "slide-prev");
    void grid.offsetWidth;   // 重新触发动画
    grid.classList.add(dir > 0 ? "slide-next" : "slide-prev");
  }
  $("btn-prev-month").addEventListener("click", () => shiftMonth(-1));
  $("btn-next-month").addEventListener("click", () => shiftMonth(1));

  // 手机上在日历上左右滑动切换月份：向左滑 → 下个月，向右滑 → 上个月
  const cal = document.querySelector(".cal");
  let touch = null;
  cal.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  cal.addEventListener("touchend", e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    const fast = Date.now() - touch.t < 800;
    touch = null;
    // 横向移动超过 40px，且明显大于纵向移动（避免和上下滚动页面冲突）
    if (fast && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) shiftMonth(dx < 0 ? 1 : -1);
  }, { passive: true });
  cal.addEventListener("touchcancel", () => { touch = null; }, { passive: true });
  $("btn-today").addEventListener("click", () => select(todayIso));
  $("btn-review").addEventListener("click", () => select(SESSIONS[0].start));
  // 点语言椭圆框里的任何位置都切换：点到另一种语言就选它，点到当前语言或空白处就换成另一种
  document.querySelector(".lang").addEventListener("click", e => {
    const b = e.target.closest("[data-lang]");
    setLang(b && b.dataset.lang !== lang ? b.dataset.lang : (lang === "zh" ? "en" : "zh"));
  });
  document.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea")) return;
    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!step) return;
    const d = parse(selected); d.setDate(d.getDate() + step); select(iso(d));
  });

  renderAll();

  // 只显示到今天时：每分钟检查一次，到了发布时间或跨过午夜就自动刷新
  if (!showAll) {
    setInterval(() => {
      const wasToday = todayIso;
      if (!refreshVisible()) return;
      // 正在看“今天”（或等待发布）的读者，跟着切换到新内容
      if (selected === wasToday) { selected = todayIso; view = parse(todayIso); view.setDate(1); }
      renderAll();
    }, 60 * 1000);
  }
})();
