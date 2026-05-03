// Lista de la compra: agregación local desde state.items o desde API.
// Persistencia de checks en localStorage por rango de fechas.
const ShoppingList = (function () {
  const $ = (id) => document.getElementById(id);
  let currentData = null;     // { desde, hasta, grupos:[...] }
  let currentKey = null;      // ls key

  function lsKey(desde, hasta) { return `shop:${desde}:${hasta}`; }

  function loadChecks(key) {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch { return {}; }
  }
  function saveChecks(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function aggregateFromItems(items, desde, hasta) {
    // items: array de menu_items (cada uno con .alimento y .cantidad_g)
    const map = {}; // alimento_id -> { ...info, total_g, fechas:Set, comidas:Set }
    items.forEach(it => {
      const a = it.alimento;
      if (!a) return;
      if (!map[a.id]) {
        map[a.id] = {
          alimento_id: a.id,
          nombre: a.nombre,
          categoria: a.categoria || "otros",
          emoji: a.emoji || "🍽️",
          total_g: 0,
          apariciones: 0,
          fechas: new Set(),
          comidas: new Set(),
        };
      }
      map[a.id].total_g += it.cantidad_g;
      map[a.id].apariciones++;
      map[a.id].fechas.add(it.fecha);
      map[a.id].comidas.add(it.comida);
    });

    // Agrupar por categoría
    const byCat = {};
    Object.values(map).forEach(it => {
      it.total_g = +it.total_g.toFixed(1);
      it.fechas = Array.from(it.fechas);
      it.comidas = Array.from(it.comidas);
      if (!byCat[it.categoria]) byCat[it.categoria] = [];
      byCat[it.categoria].push(it);
    });

    const grupos = Object.keys(byCat).sort().map(cat => ({
      categoria: cat,
      items: byCat[cat].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    }));

    return { desde, hasta, total_alimentos: Object.keys(map).length, grupos };
  }

  function fmtRange(desde, hasta) {
    const opts = { day: "2-digit", month: "short" };
    return `${new Date(desde + "T00:00:00").toLocaleDateString("es-ES", opts)} – ${new Date(hasta + "T00:00:00").toLocaleDateString("es-ES", opts)}`;
  }

  function categoriaEmoji(cat) {
    return ({
      verduras: "🥬", frutas: "🍎", proteina: "🍗", lacteos: "🥛",
      cereales: "🌾", "frutos secos": "🌰", bebidas: "🥤", platos: "🍽️", otros: "🛒",
    })[cat] || "🛒";
  }

  function render(data) {
    currentData = data;
    currentKey = lsKey(data.desde, data.hasta);
    const checks = loadChecks(currentKey);
    const body = $("shopBody");

    $("shopSub").textContent = `Semana del ${fmtRange(data.desde, data.hasta)} · ${data.total_alimentos} alimento${data.total_alimentos !== 1 ? "s" : ""}`;

    if (!data.total_alimentos) {
      body.innerHTML = `
        <div class="shop-empty">
          <div class="shop-empty-icon">🛒</div>
          <div class="shop-empty-text">Aún no hay menú esta semana.<br>Añade comidas y vuelve a abrir la lista.</div>
        </div>`;
      updateBanner();
      return;
    }

    body.innerHTML = data.grupos.map(g => `
      <section class="shop-group" data-cat="${g.categoria}">
        <div class="shop-group-head">
          <span>${categoriaEmoji(g.categoria)}</span>
          <span>${g.categoria}</span>
          <span class="shop-group-count">(${g.items.length})</span>
        </div>
        <div class="shop-items">
          ${g.items.map(it => {
            const isChecked = !!checks[it.alimento_id];
            const meta = `${it.apariciones}× · ${it.comidas.join(" · ")}`;
            return `
              <label class="shop-item${isChecked ? " checked" : ""}" data-id="${it.alimento_id}">
                <input type="checkbox" ${isChecked ? "checked" : ""} aria-label="${it.nombre}">
                <span class="shop-item-emoji">${it.emoji}</span>
                <span class="shop-item-info">
                  <div class="shop-item-name">${it.nombre}</div>
                  <div class="shop-item-meta">${meta}</div>
                </span>
                <span class="shop-item-qty">${formatQty(it.total_g)}</span>
              </label>`;
          }).join("")}
        </div>
      </section>
    `).join("");

    body.querySelectorAll(".shop-item input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", onCheck);
    });

    updateBanner();
  }

  function formatQty(g) {
    if (g >= 1000) return `${(g / 1000).toFixed(2)} kg`;
    return `${Math.round(g)} g`;
  }

  function onCheck(ev) {
    const item = ev.target.closest(".shop-item");
    const id = item.dataset.id;
    const checks = loadChecks(currentKey);
    if (ev.target.checked) {
      checks[id] = true;
      item.classList.add("checked");
      announce(`${item.querySelector(".shop-item-name").textContent} marcado como comprado`);
    } else {
      delete checks[id];
      item.classList.remove("checked");
    }
    saveChecks(currentKey, checks);
    updateBanner();
  }

  function announce(msg) {
    $("shopLive").textContent = msg;
  }

  function updateBanner() {
    if (!currentData) return;
    const checks = loadChecks(currentKey);
    const total = currentData.total_alimentos;
    const checkedCount = Object.keys(checks).filter(k => checks[k]).length;
    $("shopBanner").hidden = !(total > 0 && checkedCount === total);
  }

  function clearChecks() {
    if (!currentKey) return;
    if (!confirm("¿Limpiar todos los marcados de esta semana?")) return;
    saveChecks(currentKey, {});
    render(currentData);
  }

  function buildPlainText() {
    if (!currentData) return "";
    const lines = [`# Lista de la compra · ${fmtRange(currentData.desde, currentData.hasta)}`, ""];
    currentData.grupos.forEach(g => {
      lines.push(`## ${categoriaEmoji(g.categoria)} ${g.categoria}`);
      g.items.forEach(it => lines.push(`- ${it.nombre} — ${formatQty(it.total_g)}`));
      lines.push("");
    });
    return lines.join("\n");
  }

  async function copyList() {
    const txt = buildPlainText();
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const btn = $("shopCopy");
    const label = $("shopCopyLabel");
    const orig = label.textContent;
    label.textContent = "Copiado ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      label.textContent = orig;
      btn.classList.remove("copied");
    }, 1500);
  }

  function open() {
    $("shopDrawer").setAttribute("aria-hidden", "false");
    setTimeout(() => $("shopClose").focus(), 100);
  }
  function close() {
    $("shopDrawer").setAttribute("aria-hidden", "true");
  }

  function init({ getRange, getItems, online }) {
    $("shopBtn").addEventListener("click", async () => {
      const { desde, hasta } = getRange();
      open();
      $("shopBody").innerHTML = `
        <div class="shop-loading">
          <div class="skeleton" style="height: 28px; margin-bottom: 12px;"></div>
          <div class="skeleton" style="height: 48px; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 48px; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 48px;"></div>
        </div>`;
      try {
        if (online()) {
          const data = await API.getCompras(desde, hasta);
          render(data);
        } else {
          render(aggregateFromItems(getItems(), desde, hasta));
        }
      } catch (e) {
        // fallback a agregación local
        render(aggregateFromItems(getItems(), desde, hasta));
      }
    });

    $("shopClose").addEventListener("click", close);
    $("shopOverlay").addEventListener("click", close);
    $("shopClear").addEventListener("click", clearChecks);
    $("shopCopy").addEventListener("click", copyList);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("shopDrawer").getAttribute("aria-hidden") === "false") {
        close();
      }
    });
  }

  return { init };
})();
