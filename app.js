// 《生命同行营》第二期 / Life Together：读取 prayers.js 中的 window.PRAYERS，显示月历与当日灵修（中 / EN）。
(function () {
  const data = window.PRAYERS || [];
  const byDate = new Map(data.map(d => [d.date, d]));
  const dates = data.map(d => d.date).sort();

  const T = {
    zh: {
      brand: "《生命同行营》", sub: "第二期 · 每日读经 · 祷告",
      today: "回到今天", prevM: "上个月", nextM: "下个月", legend: "已有灵修内容",
      week: ["一", "二", "三", "四", "五", "六", "日"],
      wd: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      month: (y, m) => `${y} 年 ${m} 月`, day: (y, m, d) => `${y} 年 ${m} 月 ${d} 日`,
      interp: "经文解读", prayer: "今日祷告", prev: "‹ 前一篇", next: "后一篇 ›",
      emptyT: "本日内容尚未生成", emptyS: "有内容的日期在日历上带有小圆点。", none: "暂无内容",
      acts: [["adoration", "A", "Adoration", "赞美"], ["confession", "C", "Confession", "认罪"],
             ["thanksgiving", "T", "Thanksgiving", "感谢"], ["supplication", "S", "Supplication", "祈求"]],
      foot: "经文：新标点和合本　·　解读参考：《圣经综合解读》cmcbiblereading.com"
    },
    en: {
      brand: "Life Together", sub: "Session 2 · Daily Scripture & Prayer",
      today: "Today", prevM: "Previous month", nextM: "Next month", legend: "Devotion available",
      week: ["M", "T", "W", "T", "F", "S", "S"],
      wd: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      month: (y, m) => `${["January","February","March","April","May","June","July","August","September","October","November","December"][m - 1]} ${y}`,
      day: (y, m, d) => `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1]} ${d}, ${y}`,
      interp: "Reflection", prayer: "Today's Prayer", prev: "‹ Previous", next: "Next ›",
      emptyT: "No devotion for this day yet", emptyS: "Days with a devotion are marked with a dot.", none: "no devotion yet",
      acts: [["adoration", "A", "Adoration", ""], ["confession", "C", "Confession", ""],
             ["thanksgiving", "T", "Thanksgiving", ""], ["supplication", "S", "Supplication", ""]],
      foot: "Scripture: Berean Standard Bible (BSB), public domain　·　Reflections drawn from cmcbiblereading.com"
    }
  };

  let lang = "zh";
  try { const s = localStorage.getItem("lt-lang"); if (s === "en" || s === "zh") lang = s; } catch (e) {}

  const pad = n => String(n).padStart(2, "0");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = id => document.getElementById(id);

  const todayIso = iso(new Date());
  function defaultDate() {
    if (byDate.has(todayIso) || !dates.length) return todayIso;
    return dates.reduce((a, b) => Math.abs(parse(b) - parse(todayIso)) < Math.abs(parse(a) - parse(todayIso)) ? b : a);
  }
  let selected = defaultDate();
  let view = parse(selected); view.setDate(1);

  // 取当前语言的内容；英文缺失时回退到中文
  const content = item => (lang === "en" && item.en) ? item.en : item;
  const nivUrl = ref => "https://www.biblegateway.com/passage/?search=" + encodeURIComponent(ref.replace(/–/g, "-")) + "&version=NIV";

  function renderChrome() {
    const t = T[lang];
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.body.classList.toggle("is-en", lang === "en");
    $("brand-name").textContent = t.brand;
    $("brand-sub").textContent = t.sub;
    $("btn-today").textContent = t.today;
    $("btn-prev-month").setAttribute("aria-label", t.prevM);
    $("btn-next-month").setAttribute("aria-label", t.nextM);
    $("legend").textContent = t.legend;
    $("foot").textContent = t.foot;
    $("cal-week").innerHTML = t.week.map(w => `<span>${w}</span>`).join("");
    ["zh", "en"].forEach(l => $("lang-" + l).setAttribute("aria-pressed", String(l === lang)));
  }

  function renderCalendar() {
    const t = T[lang];
    $("month-label").textContent = t.month(view.getFullYear(), view.getMonth() + 1);
    const lead = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;   // 周一为一周第一天
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
      $("reading").innerHTML = `${dateRow}<div class="empty"><strong>${t.emptyT}</strong><span>${t.emptyS}</span></div>${pager}`;
      return;
    }
    const c = content(item);
    const verses = c.verses.map(v => `<sup>${v.v}</sup>${esc(v.t)}`).join(lang === "en" ? " " : "");
    const acts = t.acts.map(([k, letter, full, zh]) =>
      `<p><b><em>${letter}</em><i>${full}</i>${zh}</b><span>${esc(c.prayer[k])}</span></p>`).join("");
    const refLine = lang === "en"
      ? `<p class="r-ref">${esc(c.ref)} <span class="ver">BSB</span><a class="niv" href="${nivUrl(c.ref)}" target="_blank" rel="noopener">Read in NIV ↗</a></p>`
      : `<p class="r-ref">${esc(c.ref)} <span class="ver">和合本</span></p>`;
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
  $("btn-prev-month").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); renderCalendar(); });
  $("btn-next-month").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); renderCalendar(); });
  $("btn-today").addEventListener("click", () => select(todayIso));
  document.querySelector(".lang").addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) setLang(b.dataset.lang); });
  document.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea")) return;
    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!step) return;
    const d = parse(selected); d.setDate(d.getDate() + step); select(iso(d));
  });

  renderAll();
})();
