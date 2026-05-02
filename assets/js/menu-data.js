// Edita aquí el menú. Cada día tiene 4 comidas.
const MENU_SEMANAL = {
  lunes: {
    desayuno: "Avena con frutas y miel",
    almuerzo: "Pollo a la plancha con arroz integral y ensalada",
    merienda: "Yogur natural con granola",
    cena: "Tortilla de espinacas y tostadas integrales"
  },
  martes: {
    desayuno: "Tostadas de aguacate y huevo poché",
    almuerzo: "Pasta con salsa de tomate y albóndigas",
    merienda: "Manzana y puñado de almendras",
    cena: "Sopa de verduras y queso fresco"
  },
  miercoles: {
    desayuno: "Smoothie de plátano, leche y cacao",
    almuerzo: "Salmón al horno con quinoa y brócoli",
    merienda: "Sandwich de pavo y queso",
    cena: "Ensalada César con pollo"
  },
  jueves: {
    desayuno: "Pancakes integrales con frutos rojos",
    almuerzo: "Lentejas estofadas con verduras",
    merienda: "Batido de proteína y galletas integrales",
    cena: "Pizza casera de vegetales"
  },
  viernes: {
    desayuno: "Huevos revueltos con tostadas y zumo",
    almuerzo: "Hamburguesa casera con boniato al horno",
    merienda: "Frutas variadas y nueces",
    cena: "Sushi o wok de fideos con verduras"
  },
  sabado: {
    desayuno: "Croissant integral, café y fruta",
    almuerzo: "Paella mixta",
    merienda: "Bizcocho casero y té",
    cena: "Tabla de quesos, jamón y pan artesanal"
  },
  domingo: {
    desayuno: "Tortitas con sirope de arce y plátano",
    almuerzo: "Asado con patatas al horno y ensalada",
    merienda: "Helado o yogur con frutas",
    cena: "Crema de calabaza y bocadillo ligero"
  }
};

const MEAL_ORDER = [
  { key: "desayuno", label: "Desayuno" },
  { key: "almuerzo", label: "Almuerzo" },
  { key: "merienda", label: "Merienda" },
  { key: "cena",     label: "Cena" }
];

const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
