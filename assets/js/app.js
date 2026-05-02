(function () {
  let weekOffset = 0;

  const grid = document.getElementById("menuGrid");
  const weekLabel = document.getElementById("weekLabel");
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatDate(d) {
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }

  function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function render() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monday = getMonday(today);
    monday.setDate(monday.getDate() + weekOffset * 7);

    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    weekLabel.textContent = `${formatDate(monday)} – ${formatDate(sunday)}`;

    grid.innerHTML = "";

    DAY_ORDER.forEach((dayKey, idx) => {
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + idx);

      const card = document.createElement("article");
      card.className = "day-card";
      if (isSameDate(dayDate, today)) card.classList.add("today");

      const header = document.createElement("div");
      header.className = "day-header";
      header.innerHTML = `
        <h2>${dayKey} <small style="color:var(--color-muted);font-weight:400">${formatDate(dayDate)}</small></h2>
        ${isSameDate(dayDate, today) ? '<span class="badge">Hoy</span>' : ''}
      `;
      card.appendChild(header);

      const meals = document.createElement("div");
      meals.className = "meals";

      MEAL_ORDER.forEach(({ key, label }) => {
        const meal = document.createElement("div");
        meal.className = "meal";
        meal.innerHTML = `
          <div class="meal-label">${label}</div>
          <div class="meal-name">${MENU_SEMANAL[dayKey][key]}</div>
        `;
        meals.appendChild(meal);
      });

      card.appendChild(meals);
      grid.appendChild(card);
    });
  }

  prevBtn.addEventListener("click", () => { weekOffset--; render(); });
  nextBtn.addEventListener("click", () => { weekOffset++; render(); });

  render();
})();
