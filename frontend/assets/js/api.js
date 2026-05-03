// Cliente HTTP. Si el backend no responde se entra en modo offline (lectura sobre datos locales).
const API = (function () {
  const base = ""; // mismo origen
  let online = false;

  async function probe() {
    try {
      const r = await fetch(base + "/api/health", { cache: "no-store" });
      online = r.ok;
    } catch { online = false; }
    return online;
  }

  async function req(path, opts = {}) {
    const r = await fetch(base + path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  }

  return {
    isOnline: () => online,
    probe,
    listAlimentos:   (q)        => req(`/api/alimentos${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    getMenu:         (desde, hasta) => req(`/api/menu?desde=${desde}&hasta=${hasta}`),
    addItem:         (data)     => req("/api/menu", { method: "POST", body: JSON.stringify(data) }),
    updateItem:      (id, data) => req(`/api/menu/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteItem:      (id)       => req(`/api/menu/${id}`, { method: "DELETE" }),
  };
})();
