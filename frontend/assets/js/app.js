(function () {
  // === Estado ===
  const state = {
    weekOffset: 0,
    items: [],          // items del menú visible
    alimentos: [],      // catálogo
    online: false,
    drawer: {
      open: false,
      mode: "add",      // "add" | "edit"
      fecha: null,
      comida: null,
      itemId: null,
      selectedAli: null,
      cantidad: 100,
    },
  };

  // === DOM refs ===
  const $ = (id) => document.getElementById(id);
  const grid = $("menuGrid");
  const weekLabel = $("weekLabel");
  const modeBadge = $("modeBadge");
  const readonlyBanner = $("readonlyBanner");

  // === Helpers fechas ===
  function getMonday(d) {
    const x = new Date(d);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  function isoDate(d) { return d.toISOString().slice(0, 10); }
  function fmtDay(d) { return d.toLocaleDateString("es-ES", { weekday: "long" }); }
  function fmtShort(d) { return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }); }
  function isSame(a, b) {
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function currentWeekRange() {
    const today = new Date(); today.setHours(0,0,0,0);
    const monday = getMonday(today);
    monday.setDate(monday.getDate() + state.weekOffset * 7);
    const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
    return { monday, sunday };
  }

  // === Cálculo macros ===
  function macrosFromItem(it) {
    return it.macros || {
      kcal: +((it.alimento.kcal * it.cantidad_g) / it.alimento.porcion_g).toFixed(1),
      carbs_g: +((it.alimento.carbs_g * it.cantidad_g) / it.alimento.porcion_g).toFixed(1),
      proteina_g: +((it.alimento.proteina_g * it.cantidad_g) / it.alimento.porcion_g).toFixed(1),
      grasa_g: +((it.alimento.grasa_g * it.cantidad_g) / it.alimento.porcion_g).toFixed(1),
    };
  }

  function sumMacros(items) {
    return items.reduce((acc, it) => {
      const m = macrosFromItem(it);
      acc.kcal += m.kcal; acc.carbs_g += m.carbs_g;
      acc.proteina_g += m.proteina_g; acc.grasa_g += m.grasa_g;
      return acc;
    }, { kcal: 0, carbs_g: 0, proteina_g: 0, grasa_g: 0 });
  }

  // === Render ===
  const COMIDAS = [
    { key: "desayuno", label: "Desayuno" },
    { key: "almuerzo", label: "Almuerzo" },
    { key: "merienda", label: "Merienda" },
    { key: "cena",     label: "Cena" },
  ];
  const DAYS = 7;

  function macroRingSVG(carbs, prot, fat) {
    const total = Math.max(carbs + prot + fat, 0.0001);
    const C = 2 * Math.PI * 22; // r=22
    const offsetCarbs = 0;
    const lenCarbs = (carbs / total) * C;
    const offsetProt = lenCarbs;
    const lenProt = (prot / total) * C;
    const offsetFat = lenCarbs + lenProt;
    const lenFat = (fat / total) * C;
    return `
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle class="ring-bg" cx="28" cy="28" r="22"/>
        <circle class="ring-seg" cx="28" cy="28" r="22"
          stroke="var(--c-carbs)"
          stroke-dasharray="${lenCarbs} ${C - lenCarbs}"
          stroke-dashoffset="${-offsetCarbs}"/>
        <circle class="ring-seg" cx="28" cy="28" r="22"
          stroke="var(--c-prot)"
          stroke-dasharray="${lenProt} ${C - lenProt}"
          stroke-dashoffset="${-offsetProt}"/>
        <circle class="ring-seg" cx="28" cy="28" r="22"
          stroke="var(--c-fat)"
          stroke-dasharray="${lenFat} ${C - lenFat}"
          stroke-dashoffset="${-offsetFat}"/>
      </svg>`;
  }

  function renderDayCard(date, items) {
    const today = new Date(); today.setHours(0,0,0,0);
    const isToday = isSame(date, today);

    const total = sumMacros(items);
    const card = document.createElement("article");
    card.className = "day-card" + (isToday ? " today" : "");

    const fechaIso = isoDate(date);

    // Header
    const head = document.createElement("div");
    head.className = "day-head";
    head.innerHTML = `
      <div class="day-title">
        <span class="day-name">${fmtDay(date)}</span>
        <span class="day-date">${fmtShort(date)}</span>
        ${isToday ? '<span class="badge-today">Hoy</span>' : ''}
      </div>
      <div class="ring">
        ${macroRingSVG(total.carbs_g, total.proteina_g, total.grasa_g)}
        <div class="ring-text">${Math.round(total.kcal)}<small>kcal</small></div>
      </div>
    `;
    card.appendChild(head);

    // Comidas
    COMIDAS.forEach(({ key, label }) => {
      const mealItems = items.filter(i => i.comida === key)
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
      const mealTotal = sumMacros(mealItems);

      const sec = document.createElement("section");
      sec.className = "meal-section";

      const head = document.createElement("div");
      head.className = "meal-head";
      head.innerHTML = `
        <span class="meal-label">${label}</span>
        <span class="meal-meta"><strong>${Math.round(mealTotal.kcal)}</strong> kcal · ${mealTotal.carbs_g.toFixed(0)}c · ${mealTotal.proteina_g.toFixed(0)}p · ${mealTotal.grasa_g.toFixed(0)}g</span>
      `;
      sec.appendChild(head);

      const list = document.createElement("div");
      list.className = "meal-items";

      mealItems.forEach(it => {
        const m = macrosFromItem(it);
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
          <span class="item-emoji">${it.alimento.emoji || "🍽️"}</span>
          <span class="item-name" title="${escapeHtml(it.alimento.nombre)}">${escapeHtml(it.alimento.nombre)}</span>
          <span class="item-grams">${Math.round(it.cantidad_g)}g</span>
          <span class="item-macros">
            <span class="macro-chip" title="kcal">${Math.round(m.kcal)}</span>
            <span class="macro-chip" style="color:var(--c-carbs)" title="carbohidratos">${m.carbs_g.toFixed(0)}c</span>
            <span class="macro-chip" style="color:var(--c-prot)" title="proteína">${m.proteina_g.toFixed(0)}p</span>
            <span class="macro-chip" style="color:var(--c-fat)" title="grasa">${m.grasa_g.toFixed(0)}g</span>
          </span>
        `;
        row.addEventListener("click", () => openDrawer({ mode: "edit", item: it }));
        list.appendChild(row);
      });

      const addBtn = document.createElement("button");
      addBtn.className = "add-btn";
      addBtn.textContent = "+ Agregar";
      addBtn.addEventListener("click", () => openDrawer({ mode: "add", fecha: fechaIso, comida: key }));
      list.appendChild(addBtn);

      sec.appendChild(list);
      card.appendChild(sec);
    });

    // Footer
    const foot = document.createElement("div");
    foot.className = "day-foot";
    foot.innerHTML = `
      <span class="day-foot-label">Total del día</span>
      <span class="day-foot-val">${Math.round(total.kcal)} kcal · ${total.carbs_g.toFixed(0)}c · ${total.proteina_g.toFixed(0)}p · ${total.grasa_g.toFixed(0)}g</span>
    `;
    card.appendChild(foot);

    return card;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function renderWeekSummary(items, days) {
    const total = sumMacros(items);
    const avgKcal = days > 0 ? total.kcal / days : 0;
    $("sumKcalDia").textContent = Math.round(avgKcal).toLocaleString();
    $("sumKcalSemana").textContent = Math.round(total.kcal).toLocaleString();

    // Barras: porcentaje sobre el total semanal en gramos
    const sumG = total.carbs_g + total.proteina_g + total.grasa_g || 1;
    const pCarbs = (total.carbs_g / sumG) * 100;
    const pProt  = (total.proteina_g / sumG) * 100;
    const pFat   = (total.grasa_g / sumG) * 100;
    $("barCarbs").style.width = pCarbs.toFixed(1) + "%";
    $("barProt").style.width  = pProt.toFixed(1) + "%";
    $("barFat").style.width   = pFat.toFixed(1) + "%";
    $("valCarbs").textContent = `${total.carbs_g.toFixed(0)}g`;
    $("valProt").textContent  = `${total.proteina_g.toFixed(0)}g`;
    $("valFat").textContent   = `${total.grasa_g.toFixed(0)}g`;
  }

  async function render() {
    const { monday, sunday } = currentWeekRange();
    weekLabel.textContent = `${fmtShort(monday)} – ${fmtShort(sunday)}`;

    grid.innerHTML = "";
    // Skeletons
    for (let i = 0; i < DAYS; i++) {
      const sk = document.createElement("div");
      sk.className = "day-card";
      sk.innerHTML = `<div class="skeleton" style="height: 320px;"></div>`;
      grid.appendChild(sk);
    }

    try {
      if (state.online) {
        state.items = await API.getMenu(isoDate(monday), isoDate(sunday));
      } else {
        state.items = fallbackBuildMenu(isoDate(monday), isoDate(sunday));
      }
    } catch (e) {
      console.error(e);
      state.items = fallbackBuildMenu(isoDate(monday), isoDate(sunday));
    }

    // Render
    grid.innerHTML = "";
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(monday); d.setDate(d.getDate() + i);
      const dayItems = state.items.filter(it => it.fecha === isoDate(d));
      grid.appendChild(renderDayCard(d, dayItems));
    }
    renderWeekSummary(state.items, DAYS);
  }

  // === Drawer ===
  const drawer = $("drawer");
  const searchInput = $("searchInput");
  const searchResults = $("searchResults");
  const selectedPane = $("selectedPane");
  const cantidadInput = $("cantidadInput");
  const macrosPreview = $("macrosPreview");
  const btnSave = $("btnSave");
  const btnDeleteItem = $("btnDeleteItem");

  function openDrawer({ mode, fecha, comida, item }) {
    state.drawer.open = true;
    state.drawer.mode = mode;
    state.drawer.itemId = item ? item.id : null;
    state.drawer.fecha = fecha || (item ? item.fecha : null);
    state.drawer.comida = comida || (item ? item.comida : null);
    state.drawer.selectedAli = item ? item.alimento : null;
    state.drawer.cantidad = item ? item.cantidad_g : 100;

    $("drawerTitle").textContent = mode === "edit" ? "Editar comida" : "Agregar alimento";
    btnDeleteItem.hidden = mode !== "edit" || !state.online;
    cantidadInput.value = state.drawer.cantidad;
    searchInput.value = "";
    searchResults.innerHTML = "";

    if (state.drawer.selectedAli) {
      showSelectedPane();
    } else {
      selectedPane.hidden = true;
      btnSave.disabled = true;
    }

    drawer.setAttribute("aria-hidden", "false");
    setTimeout(() => searchInput.focus(), 100);
    renderSearchResults("");
  }

  function closeDrawer() {
    state.drawer.open = false;
    drawer.setAttribute("aria-hidden", "true");
  }

  function showSelectedPane() {
    const a = state.drawer.selectedAli;
    if (!a) return;
    selectedPane.hidden = false;
    btnSave.disabled = !state.online;
    if (!state.online) btnSave.title = "Activa el backend local para guardar";
    $("selectedEmoji").textContent = a.emoji || "🍽️";
    $("selectedNombre").textContent = a.nombre;
    $("selectedCat").textContent = a.categoria || "";
    updateMacrosPreview();
  }

  function updateMacrosPreview() {
    const a = state.drawer.selectedAli;
    if (!a) return;
    const factor = (state.drawer.cantidad || 0) / a.porcion_g;
    const m = {
      kcal: a.kcal * factor,
      carbs: a.carbs_g * factor,
      prot: a.proteina_g * factor,
      fat: a.grasa_g * factor,
    };
    macrosPreview.innerHTML = `
      <div class="mp-cell kcal"><div class="mp-label">kcal</div><div class="mp-value">${Math.round(m.kcal)}</div></div>
      <div class="mp-cell carbs"><div class="mp-label">Carbs</div><div class="mp-value">${m.carbs.toFixed(1)}g</div></div>
      <div class="mp-cell prot"><div class="mp-label">Proteína</div><div class="mp-value">${m.prot.toFixed(1)}g</div></div>
      <div class="mp-cell fat"><div class="mp-label">Grasa</div><div class="mp-value">${m.fat.toFixed(1)}g</div></div>
    `;
  }

  function renderSearchResults(q) {
    const ql = (q || "").toLowerCase().trim();
    const list = state.alimentos
      .filter(a => !ql || a.nombre.toLowerCase().includes(ql) || (a.categoria || "").includes(ql))
      .slice(0, 30);

    searchResults.innerHTML = list.map(a => {
      const sel = state.drawer.selectedAli && state.drawer.selectedAli.id === a.id ? " selected" : "";
      return `
        <div class="search-result${sel}" data-id="${a.id}">
          <span class="sr-emoji">${a.emoji || "🍽️"}</span>
          <span class="sr-info">
            <div class="sr-name">${escapeHtml(a.nombre)}</div>
            <div class="sr-cat">${a.categoria || ""}</div>
          </span>
          <span class="sr-kcal">${Math.round(a.kcal)} kcal · ${a.porcion_g}g</span>
        </div>`;
    }).join("");

    searchResults.querySelectorAll(".search-result").forEach(el => {
      el.addEventListener("click", () => {
        const id = parseInt(el.dataset.id, 10);
        const a = state.alimentos.find(x => x.id === id);
        state.drawer.selectedAli = a;
        state.drawer.cantidad = parseFloat(cantidadInput.value) || a.porcion_g;
        cantidadInput.value = state.drawer.cantidad;
        renderSearchResults(searchInput.value);
        showSelectedPane();
      });
    });
  }

  async function saveDrawer() {
    if (!state.online) return;
    const a = state.drawer.selectedAli;
    if (!a) return;
    const cantidad = parseFloat(cantidadInput.value);
    if (!cantidad || cantidad <= 0) return;

    btnSave.disabled = true;
    try {
      if (state.drawer.mode === "edit") {
        await API.updateItem(state.drawer.itemId, {
          alimento_id: a.id,
          cantidad_g: cantidad,
        });
      } else {
        await API.addItem({
          fecha: state.drawer.fecha,
          comida: state.drawer.comida,
          alimento_id: a.id,
          cantidad_g: cantidad,
          orden: 99,
        });
      }
      closeDrawer();
      await render();
    } catch (e) {
      alert("No se pudo guardar: " + e.message);
      btnSave.disabled = false;
    }
  }

  async function deleteCurrent() {
    if (!state.online || state.drawer.mode !== "edit") return;
    if (!confirm("¿Eliminar esta comida del día?")) return;
    try {
      await API.deleteItem(state.drawer.itemId);
      closeDrawer();
      await render();
    } catch (e) {
      alert("No se pudo eliminar: " + e.message);
    }
  }

  // === Tema ===
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    $("iconSun").style.display  = theme === "dark"  ? "" : "none";
    $("iconMoon").style.display = theme === "light" ? "" : "none";
  }

  // === Init ===
  async function init() {
    // Tema
    const saved = localStorage.getItem("theme") || "dark";
    applyTheme(saved);
    $("themeToggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    // Probar backend
    try {
      state.online = await API.probe();
    } catch { state.online = false; }

    if (state.online) {
      modeBadge.textContent = "online · datos persistidos";
      modeBadge.classList.add("online");
      readonlyBanner.hidden = true;
      try {
        state.alimentos = await API.listAlimentos();
      } catch {
        state.alimentos = FALLBACK_ALIMENTOS.slice();
      }
    } else {
      modeBadge.textContent = "offline · solo lectura";
      modeBadge.classList.add("offline");
      readonlyBanner.hidden = false;
      state.alimentos = FALLBACK_ALIMENTOS.slice();
    }

    // Eventos
    $("prevWeek").addEventListener("click", () => { state.weekOffset--; render(); });
    $("nextWeek").addEventListener("click", () => { state.weekOffset++; render(); });
    $("todayBtn").addEventListener("click", () => { state.weekOffset = 0; render(); });

    $("drawerOverlay").addEventListener("click", closeDrawer);
    $("drawerClose").addEventListener("click", closeDrawer);
    $("btnCancel").addEventListener("click", closeDrawer);
    $("btnSave").addEventListener("click", saveDrawer);
    btnDeleteItem.addEventListener("click", deleteCurrent);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.drawer.open) closeDrawer();
    });

    searchInput.addEventListener("input", (e) => renderSearchResults(e.target.value));
    cantidadInput.addEventListener("input", () => {
      state.drawer.cantidad = parseFloat(cantidadInput.value) || 0;
      updateMacrosPreview();
    });

    await render();
  }

  init();
})();
