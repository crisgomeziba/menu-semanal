// Datos de respaldo cuando no hay backend (ej. GitHub Pages).
// Mismos macros que el seed del backend.
const FALLBACK_ALIMENTOS = [
  { id: 1,  nombre: "Avena cocida con leche", categoria: "cereales", porcion_g: 200, kcal: 158, carbs_g: 22,  proteina_g: 6.5, grasa_g: 4.5, emoji: "🥣" },
  { id: 2,  nombre: "Pan integral tostado",   categoria: "cereales", porcion_g: 30,  kcal: 80,  carbs_g: 14,  proteina_g: 4.0, grasa_g: 1.1, emoji: "🍞" },
  { id: 3,  nombre: "Arroz integral cocido",  categoria: "cereales", porcion_g: 150, kcal: 167, carbs_g: 35,  proteina_g: 3.9, grasa_g: 1.4, emoji: "🍚" },
  { id: 4,  nombre: "Pasta integral cocida",  categoria: "cereales", porcion_g: 180, kcal: 220, carbs_g: 42,  proteina_g: 8.5, grasa_g: 1.8, emoji: "🍝" },
  { id: 5,  nombre: "Quinoa cocida",          categoria: "cereales", porcion_g: 150, kcal: 180, carbs_g: 31,  proteina_g: 6.6, grasa_g: 2.9, emoji: "🌾" },
  { id: 7,  nombre: "Pancake integral",       categoria: "cereales", porcion_g: 80,  kcal: 170, carbs_g: 25,  proteina_g: 6.0, grasa_g: 4.5, emoji: "🥞" },
  { id: 8,  nombre: "Granola casera",         categoria: "cereales", porcion_g: 40,  kcal: 170, carbs_g: 22,  proteina_g: 4.5, grasa_g: 7.0, emoji: "🌰" },
  { id: 10, nombre: "Pollo a la plancha",     categoria: "proteina", porcion_g: 150, kcal: 248, carbs_g: 0,   proteina_g: 46,  grasa_g: 5.4, emoji: "🍗" },
  { id: 12, nombre: "Salmón al horno",        categoria: "proteina", porcion_g: 150, kcal: 312, carbs_g: 0,   proteina_g: 30,  grasa_g: 20,  emoji: "🐟" },
  { id: 14, nombre: "Huevo entero",           categoria: "proteina", porcion_g: 50,  kcal: 78,  carbs_g: 0.6, proteina_g: 6.3, grasa_g: 5.3, emoji: "🥚" },
  { id: 15, nombre: "Huevos revueltos (2)",   categoria: "proteina", porcion_g: 100, kcal: 200, carbs_g: 1.5, proteina_g: 14,  grasa_g: 15,  emoji: "🍳" },
  { id: 16, nombre: "Tortilla de espinacas (2 huevos)", categoria: "proteina", porcion_g: 150, kcal: 220, carbs_g: 4, proteina_g: 16, grasa_g: 15, emoji: "🍳" },
  { id: 17, nombre: "Albóndigas de ternera",  categoria: "proteina", porcion_g: 150, kcal: 320, carbs_g: 8,   proteina_g: 22,  grasa_g: 22,  emoji: "🍖" },
  { id: 18, nombre: "Lentejas estofadas",     categoria: "proteina", porcion_g: 200, kcal: 230, carbs_g: 38,  proteina_g: 14,  grasa_g: 2.5, emoji: "🫘" },
  { id: 21, nombre: "Hamburguesa casera 100g",categoria: "proteina", porcion_g: 100, kcal: 250, carbs_g: 2,   proteina_g: 20,  grasa_g: 18,  emoji: "🍔" },
  { id: 22, nombre: "Yogur natural",          categoria: "lacteos",  porcion_g: 150, kcal: 90,  carbs_g: 10,  proteina_g: 7.5, grasa_g: 2.5, emoji: "🥛" },
  { id: 24, nombre: "Queso fresco",           categoria: "lacteos",  porcion_g: 60,  kcal: 130, carbs_g: 2.5, proteina_g: 9.0, grasa_g: 9.0, emoji: "🧀" },
  { id: 27, nombre: "Batido de proteína",     categoria: "lacteos",  porcion_g: 300, kcal: 180, carbs_g: 8,   proteina_g: 25,  grasa_g: 3.0, emoji: "🥤" },
  { id: 28, nombre: "Manzana",                categoria: "frutas",   porcion_g: 180, kcal: 95,  carbs_g: 25,  proteina_g: 0.5, grasa_g: 0.3, emoji: "🍎" },
  { id: 29, nombre: "Plátano",                categoria: "frutas",   porcion_g: 120, kcal: 105, carbs_g: 27,  proteina_g: 1.3, grasa_g: 0.4, emoji: "🍌" },
  { id: 30, nombre: "Frutos rojos mixtos",    categoria: "frutas",   porcion_g: 100, kcal: 50,  carbs_g: 12,  proteina_g: 0.7, grasa_g: 0.3, emoji: "🫐" },
  { id: 31, nombre: "Naranja",                categoria: "frutas",   porcion_g: 150, kcal: 70,  carbs_g: 17,  proteina_g: 1.3, grasa_g: 0.2, emoji: "🍊" },
  { id: 32, nombre: "Frutas variadas",        categoria: "frutas",   porcion_g: 200, kcal: 110, carbs_g: 28,  proteina_g: 1.5, grasa_g: 0.4, emoji: "🍓" },
  { id: 33, nombre: "Aguacate (mitad)",       categoria: "frutas",   porcion_g: 100, kcal: 160, carbs_g: 9,   proteina_g: 2.0, grasa_g: 15,  emoji: "🥑" },
  { id: 34, nombre: "Almendras",              categoria: "frutos secos", porcion_g: 30, kcal: 174, carbs_g: 6, proteina_g: 6.4, grasa_g: 15, emoji: "🌰" },
  { id: 35, nombre: "Nueces",                 categoria: "frutos secos", porcion_g: 30, kcal: 196, carbs_g: 4, proteina_g: 4.5, grasa_g: 19, emoji: "🌰" },
  { id: 37, nombre: "Brócoli al vapor",       categoria: "verduras", porcion_g: 150, kcal: 51,  carbs_g: 10,  proteina_g: 4.2, grasa_g: 0.6, emoji: "🥦" },
  { id: 39, nombre: "Crema de calabaza",      categoria: "verduras", porcion_g: 250, kcal: 130, carbs_g: 22,  proteina_g: 4.0, grasa_g: 3.5, emoji: "🍲" },
  { id: 40, nombre: "Sopa de verduras",       categoria: "verduras", porcion_g: 300, kcal: 120, carbs_g: 18,  proteina_g: 5.0, grasa_g: 3.0, emoji: "🥣" },
  { id: 41, nombre: "Boniato al horno",       categoria: "verduras", porcion_g: 150, kcal: 130, carbs_g: 30,  proteina_g: 2.4, grasa_g: 0.2, emoji: "🍠" },
  { id: 36, nombre: "Ensalada verde con tomate", categoria: "verduras", porcion_g: 200, kcal: 60, carbs_g: 10, proteina_g: 2.5, grasa_g: 0.8, emoji: "🥗" },
  { id: 43, nombre: "Sándwich de pavo y queso", categoria: "platos", porcion_g: 180, kcal: 380, carbs_g: 38, proteina_g: 24, grasa_g: 14, emoji: "🥪" },
  { id: 44, nombre: "Pizza casera vegetales (porción)", categoria: "platos", porcion_g: 150, kcal: 290, carbs_g: 35, proteina_g: 12, grasa_g: 10, emoji: "🍕" },
  { id: 45, nombre: "Sushi mixto (8 piezas)", categoria: "platos",   porcion_g: 200, kcal: 380, carbs_g: 60,  proteina_g: 14,  grasa_g: 8.0, emoji: "🍣" },
  { id: 47, nombre: "Paella mixta",           categoria: "platos",   porcion_g: 300, kcal: 480, carbs_g: 60,  proteina_g: 25,  grasa_g: 14,  emoji: "🥘" },
  { id: 48, nombre: "Asado con guarnición",   categoria: "platos",   porcion_g: 300, kcal: 580, carbs_g: 30,  proteina_g: 38,  grasa_g: 32,  emoji: "🍖" },
  { id: 49, nombre: "Tabla quesos y jamón",   categoria: "platos",   porcion_g: 200, kcal: 520, carbs_g: 8,   proteina_g: 32,  grasa_g: 38,  emoji: "🧀" },
  { id: 50, nombre: "Ensalada César con pollo", categoria: "platos", porcion_g: 300, kcal: 410, carbs_g: 18, proteina_g: 32, grasa_g: 22, emoji: "🥗" },
  { id: 51, nombre: "Bocadillo ligero",       categoria: "platos",   porcion_g: 150, kcal: 280, carbs_g: 36,  proteina_g: 14,  grasa_g: 8.0, emoji: "🥖" },
  { id: 52, nombre: "Bizcocho casero",        categoria: "platos",   porcion_g: 80,  kcal: 280, carbs_g: 38,  proteina_g: 5.0, grasa_g: 12,  emoji: "🍰" },
  { id: 53, nombre: "Helado",                 categoria: "platos",   porcion_g: 100, kcal: 200, carbs_g: 24,  proteina_g: 3.5, grasa_g: 10,  emoji: "🍦" },
  { id: 54, nombre: "Sirope de arce (cucharada)", categoria: "platos", porcion_g: 20, kcal: 52, carbs_g: 13, proteina_g: 0, grasa_g: 0, emoji: "🍯" },
  { id: 55, nombre: "Croissant integral",     categoria: "platos",   porcion_g: 60,  kcal: 240, carbs_g: 24,  proteina_g: 5.0, grasa_g: 13,  emoji: "🥐" },
  { id: 56, nombre: "Smoothie plátano y cacao", categoria: "platos", porcion_g: 300, kcal: 240, carbs_g: 38, proteina_g: 9.0, grasa_g: 6.0, emoji: "🥤" },
  { id: 57, nombre: "Café con leche",         categoria: "bebidas",  porcion_g: 200, kcal: 60,  carbs_g: 6.5, proteina_g: 3.5, grasa_g: 2.5, emoji: "☕" },
  { id: 58, nombre: "Té",                     categoria: "bebidas",  porcion_g: 200, kcal: 2,   carbs_g: 0.4, proteina_g: 0,   grasa_g: 0,   emoji: "🍵" },
  { id: 59, nombre: "Zumo de naranja natural",categoria: "bebidas",  porcion_g: 200, kcal: 90,  carbs_g: 21,  proteina_g: 1.5, grasa_g: 0.3, emoji: "🧃" },
  { id: 9,  nombre: "Galleta integral",       categoria: "cereales", porcion_g: 25,  kcal: 110, carbs_g: 16,  proteina_g: 2.0, grasa_g: 4.0, emoji: "🍪" },
];

// Menú base por offset desde el lunes (0..6)
const FALLBACK_MENU_BASE = {
  0: {
    desayuno: [["Avena cocida con leche", null], ["Frutos rojos mixtos", 80]],
    almuerzo: [["Pollo a la plancha", null], ["Arroz integral cocido", null], ["Ensalada verde con tomate", null]],
    merienda: [["Yogur natural", null], ["Granola casera", 30]],
    cena:     [["Tortilla de espinacas (2 huevos)", null], ["Pan integral tostado", null]],
  },
  1: {
    desayuno: [["Pan integral tostado", 60], ["Aguacate (mitad)", null], ["Huevo entero", 100]],
    almuerzo: [["Pasta integral cocida", null], ["Albóndigas de ternera", null]],
    merienda: [["Manzana", null], ["Almendras", null]],
    cena:     [["Sopa de verduras", null], ["Queso fresco", null]],
  },
  2: {
    desayuno: [["Smoothie plátano y cacao", null]],
    almuerzo: [["Salmón al horno", null], ["Quinoa cocida", null], ["Brócoli al vapor", null]],
    merienda: [["Sándwich de pavo y queso", null]],
    cena:     [["Ensalada César con pollo", null]],
  },
  3: {
    desayuno: [["Pancake integral", 160], ["Frutos rojos mixtos", null]],
    almuerzo: [["Lentejas estofadas", null], ["Pan integral tostado", null]],
    merienda: [["Batido de proteína", null], ["Galleta integral", 50]],
    cena:     [["Pizza casera vegetales (porción)", 300]],
  },
  4: {
    desayuno: [["Huevos revueltos (2)", null], ["Pan integral tostado", null], ["Zumo de naranja natural", null]],
    almuerzo: [["Hamburguesa casera 100g", null], ["Boniato al horno", null]],
    merienda: [["Frutas variadas", null], ["Nueces", null]],
    cena:     [["Sushi mixto (8 piezas)", null]],
  },
  5: {
    desayuno: [["Croissant integral", null], ["Café con leche", null], ["Naranja", null]],
    almuerzo: [["Paella mixta", null]],
    merienda: [["Bizcocho casero", null], ["Té", null]],
    cena:     [["Tabla quesos y jamón", null]],
  },
  6: {
    desayuno: [["Pancake integral", 160], ["Plátano", null], ["Sirope de arce (cucharada)", 30]],
    almuerzo: [["Asado con guarnición", null]],
    merienda: [["Helado", null]],
    cena:     [["Crema de calabaza", null], ["Bocadillo ligero", null]],
  },
};

// Genera items en formato de la API a partir del menú base, para el rango pedido
function fallbackBuildMenu(desde, hasta) {
  const idByName = {};
  FALLBACK_ALIMENTOS.forEach(a => { idByName[a.nombre] = a; });

  const items = [];
  let nextId = 1;

  const start = new Date(desde + "T00:00:00");
  const end   = new Date(hasta + "T00:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = (d.getDay() + 6) % 7; // 0 = lunes
    const fecha = d.toISOString().slice(0, 10);
    const day = FALLBACK_MENU_BASE[dayOfWeek];
    if (!day) continue;
    for (const comida of ["desayuno", "almuerzo", "merienda", "cena"]) {
      const list = day[comida] || [];
      list.forEach(([nombre, cantidadOverride], orden) => {
        const ali = idByName[nombre];
        if (!ali) return;
        const cantidad = cantidadOverride ?? ali.porcion_g;
        const factor = cantidad / ali.porcion_g;
        items.push({
          id: nextId++,
          fecha,
          comida,
          alimento_id: ali.id,
          cantidad_g: cantidad,
          orden,
          alimento: ali,
          macros: {
            kcal: +(ali.kcal * factor).toFixed(1),
            carbs_g: +(ali.carbs_g * factor).toFixed(1),
            proteina_g: +(ali.proteina_g * factor).toFixed(1),
            grasa_g: +(ali.grasa_g * factor).toFixed(1),
          }
        });
      });
    }
  }
  return items;
}
