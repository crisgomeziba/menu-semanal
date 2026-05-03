"""Seed con alimentos comunes (macros por porción indicada) y un menú semanal inicial."""
from datetime import date, timedelta
from db import cursor, init_db

# Macros reales aproximados. porcion_g = porción de referencia.
ALIMENTOS = [
    # (nombre, categoria, porcion_g, kcal, carbs, proteina, grasa, emoji)
    ("Avena cocida con leche",        "cereales", 200, 158, 22, 6.5, 4.5, "🥣"),
    ("Pan integral tostado",          "cereales", 30,  80,  14, 4.0, 1.1, "🍞"),
    ("Arroz integral cocido",         "cereales", 150, 167, 35, 3.9, 1.4, "🍚"),
    ("Pasta integral cocida",         "cereales", 180, 220, 42, 8.5, 1.8, "🍝"),
    ("Quinoa cocida",                 "cereales", 150, 180, 31, 6.6, 2.9, "🌾"),
    ("Tortilla de maíz",              "cereales", 30,  65,  14, 1.5, 0.7, "🫓"),
    ("Pancake integral",              "cereales", 80,  170, 25, 6.0, 4.5, "🥞"),
    ("Granola casera",                "cereales", 40,  170, 22, 4.5, 7.0, "🌰"),
    ("Galleta integral",              "cereales", 25,  110, 16, 2.0, 4.0, "🍪"),

    ("Pollo a la plancha",            "proteina", 150, 248, 0,  46,  5.4, "🍗"),
    ("Pechuga de pavo",               "proteina", 150, 195, 0,  44,  2.0, "🦃"),
    ("Salmón al horno",               "proteina", 150, 312, 0,  30,  20,  "🐟"),
    ("Atún en agua",                  "proteina", 100, 116, 0,  26,  1.0, "🐟"),
    ("Huevo entero",                  "proteina", 50,  78,  0.6, 6.3, 5.3, "🥚"),
    ("Huevos revueltos (2)",          "proteina", 100, 200, 1.5, 14,  15,  "🍳"),
    ("Tortilla de espinacas (2 huevos)","proteina",150, 220, 4,  16,  15,  "🍳"),
    ("Albóndigas de ternera",         "proteina", 150, 320, 8,  22,  22,  "🍖"),
    ("Lentejas estofadas",            "proteina", 200, 230, 38, 14,  2.5, "🫘"),
    ("Garbanzos guisados",            "proteina", 200, 280, 42, 14,  6.0, "🫘"),
    ("Tofu salteado",                 "proteina", 150, 220, 5,  18,  14,  "🟫"),
    ("Hamburguesa casera 100g",       "proteina", 100, 250, 2,  20,  18,  "🍔"),

    ("Yogur natural",                 "lacteos",  150, 90,  10, 7.5, 2.5, "🥛"),
    ("Yogur griego",                  "lacteos",  150, 145, 5,  15,  7.0, "🥛"),
    ("Queso fresco",                  "lacteos",  60,  130, 2.5, 9.0, 9.0, "🧀"),
    ("Queso curado",                  "lacteos",  30,  120, 1,  7.5, 10,  "🧀"),
    ("Leche entera",                  "lacteos",  250, 155, 12, 8.0, 8.5, "🥛"),
    ("Batido de proteína",            "lacteos",  300, 180, 8,  25,  3.0, "🥤"),

    ("Manzana",                       "frutas",   180, 95,  25, 0.5, 0.3, "🍎"),
    ("Plátano",                       "frutas",   120, 105, 27, 1.3, 0.4, "🍌"),
    ("Frutos rojos mixtos",           "frutas",   100, 50,  12, 0.7, 0.3, "🫐"),
    ("Naranja",                       "frutas",   150, 70,  17, 1.3, 0.2, "🍊"),
    ("Frutas variadas",               "frutas",   200, 110, 28, 1.5, 0.4, "🍓"),
    ("Aguacate (mitad)",              "frutas",   100, 160, 9,  2.0, 15,  "🥑"),

    ("Almendras",                     "frutos secos", 30, 174, 6, 6.4, 15, "🌰"),
    ("Nueces",                        "frutos secos", 30, 196, 4, 4.5, 19, "🌰"),

    ("Ensalada verde con tomate",     "verduras", 200, 60,  10, 2.5, 0.8, "🥗"),
    ("Brócoli al vapor",              "verduras", 150, 51,  10, 4.2, 0.6, "🥦"),
    ("Espinacas salteadas",           "verduras", 150, 75,  6,  4.5, 4.0, "🥬"),
    ("Crema de calabaza",             "verduras", 250, 130, 22, 4.0, 3.5, "🍲"),
    ("Sopa de verduras",              "verduras", 300, 120, 18, 5.0, 3.0, "🥣"),
    ("Boniato al horno",              "verduras", 150, 130, 30, 2.4, 0.2, "🍠"),
    ("Patatas al horno",              "verduras", 150, 140, 32, 3.0, 0.2, "🥔"),

    ("Sándwich de pavo y queso",      "platos",   180, 380, 38, 24,  14,  "🥪"),
    ("Pizza casera vegetales (porción)","platos", 150, 290, 35, 12,  10,  "🍕"),
    ("Sushi mixto (8 piezas)",        "platos",   200, 380, 60, 14,  8.0, "🍣"),
    ("Wok de fideos con verduras",    "platos",   300, 420, 65, 14,  10,  "🍜"),
    ("Paella mixta",                  "platos",   300, 480, 60, 25,  14,  "🥘"),
    ("Asado con guarnición",          "platos",   300, 580, 30, 38,  32,  "🍖"),
    ("Tabla quesos y jamón",          "platos",   200, 520, 8,  32,  38,  "🧀"),
    ("Ensalada César con pollo",      "platos",   300, 410, 18, 32,  22,  "🥗"),
    ("Bocadillo ligero",              "platos",   150, 280, 36, 14,  8.0, "🥖"),
    ("Bizcocho casero",               "platos",   80,  280, 38, 5.0, 12,  "🍰"),
    ("Helado",                        "platos",   100, 200, 24, 3.5, 10,  "🍦"),
    ("Sirope de arce (cucharada)",    "platos",   20,  52,  13, 0,   0,   "🍯"),
    ("Croissant integral",            "platos",   60,  240, 24, 5.0, 13,  "🥐"),
    ("Smoothie plátano y cacao",      "platos",   300, 240, 38, 9.0, 6.0, "🥤"),
    ("Café con leche",                "bebidas",  200, 60,  6.5, 3.5, 2.5, "☕"),
    ("Té",                            "bebidas",  200, 2,   0.4, 0,   0,   "🍵"),
    ("Zumo de naranja natural",       "bebidas",  200, 90,  21, 1.5, 0.3, "🧃"),
]


def upsert_alimentos():
    with cursor() as conn:
        for row in ALIMENTOS:
            conn.execute("""
                INSERT INTO alimentos (nombre, categoria, porcion_g, kcal, carbs_g, proteina_g, grasa_g, emoji)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(nombre) DO UPDATE SET
                  categoria=excluded.categoria,
                  porcion_g=excluded.porcion_g,
                  kcal=excluded.kcal,
                  carbs_g=excluded.carbs_g,
                  proteina_g=excluded.proteina_g,
                  grasa_g=excluded.grasa_g,
                  emoji=excluded.emoji
            """, row)


# Menú base por día de la semana (índice 0=lunes ... 6=domingo).
# Cada comida es lista de (nombre_alimento, cantidad_g_override_or_None).
MENU_BASE = {
    0: {  # lunes
        "desayuno": [("Avena cocida con leche", None), ("Frutos rojos mixtos", 80)],
        "almuerzo": [("Pollo a la plancha", None), ("Arroz integral cocido", None), ("Ensalada verde con tomate", None)],
        "merienda": [("Yogur natural", None), ("Granola casera", 30)],
        "cena":     [("Tortilla de espinacas (2 huevos)", None), ("Pan integral tostado", None)],
    },
    1: {  # martes
        "desayuno": [("Pan integral tostado", 60), ("Aguacate (mitad)", None), ("Huevo entero", 100)],
        "almuerzo": [("Pasta integral cocida", None), ("Albóndigas de ternera", None)],
        "merienda": [("Manzana", None), ("Almendras", None)],
        "cena":     [("Sopa de verduras", None), ("Queso fresco", None)],
    },
    2: {  # miércoles
        "desayuno": [("Smoothie plátano y cacao", None)],
        "almuerzo": [("Salmón al horno", None), ("Quinoa cocida", None), ("Brócoli al vapor", None)],
        "merienda": [("Sándwich de pavo y queso", None)],
        "cena":     [("Ensalada César con pollo", None)],
    },
    3: {  # jueves
        "desayuno": [("Pancake integral", 160), ("Frutos rojos mixtos", None)],
        "almuerzo": [("Lentejas estofadas", None), ("Pan integral tostado", None)],
        "merienda": [("Batido de proteína", None), ("Galleta integral", 50)],
        "cena":     [("Pizza casera vegetales (porción)", 300)],
    },
    4: {  # viernes
        "desayuno": [("Huevos revueltos (2)", None), ("Pan integral tostado", None), ("Zumo de naranja natural", None)],
        "almuerzo": [("Hamburguesa casera 100g", None), ("Boniato al horno", None)],
        "merienda": [("Frutas variadas", None), ("Nueces", None)],
        "cena":     [("Sushi mixto (8 piezas)", None)],
    },
    5: {  # sábado
        "desayuno": [("Croissant integral", None), ("Café con leche", None), ("Naranja", None)],
        "almuerzo": [("Paella mixta", None)],
        "merienda": [("Bizcocho casero", None), ("Té", None)],
        "cena":     [("Tabla quesos y jamón", None)],
    },
    6: {  # domingo
        "desayuno": [("Pancake integral", 160), ("Plátano", None), ("Sirope de arce (cucharada)", 30)],
        "almuerzo": [("Asado con guarnición", None)],
        "merienda": [("Helado", None)],
        "cena":     [("Crema de calabaza", None), ("Bocadillo ligero", None)],
    },
}


def seed_week_for(start_monday: date):
    """Inserta los items de menú para la semana cuyo lunes es start_monday."""
    with cursor() as conn:
        # Mapa nombre -> id
        rows = conn.execute("SELECT id, nombre FROM alimentos").fetchall()
        ali = {r["nombre"]: r["id"] for r in rows}

        for offset, comidas in MENU_BASE.items():
            d = start_monday + timedelta(days=offset)
            fecha = d.isoformat()
            # Borra items previos de ese día (idempotente)
            conn.execute("DELETE FROM menu_items WHERE fecha = ?", (fecha,))
            for comida, items in comidas.items():
                for orden, (nombre, cantidad) in enumerate(items):
                    if nombre not in ali:
                        continue
                    porcion = conn.execute("SELECT porcion_g FROM alimentos WHERE id = ?", (ali[nombre],)).fetchone()["porcion_g"]
                    conn.execute("""
                        INSERT INTO menu_items (fecha, comida, alimento_id, cantidad_g, orden)
                        VALUES (?, ?, ?, ?, ?)
                    """, (fecha, comida, ali[nombre], cantidad if cantidad is not None else porcion, orden))


def get_monday(d: date) -> date:
    return d - timedelta(days=d.weekday())


def run():
    init_db()
    upsert_alimentos()
    today = date.today()
    monday = get_monday(today)
    # Siembra esta semana y la siguiente
    seed_week_for(monday)
    seed_week_for(monday + timedelta(days=7))
    print(f"Seed OK. Alimentos: {len(ALIMENTOS)}. Semanas sembradas: {monday} y {monday + timedelta(days=7)}")


if __name__ == "__main__":
    run()
