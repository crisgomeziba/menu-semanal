# Menú Semanal

PoC de planificador semanal de comidas con detalle de **kcal · carbohidratos · proteína · grasa** por comida, día y semana.

- **Modo local (con base de datos):** FastAPI + SQLite. Editas el menú desde el navegador y se persiste.
- **Modo estático (GitHub Pages):** misma UI, datos de ejemplo embebidos, solo lectura.

🌐 **Demo estática:** https://crisgomeziba.github.io/menu-semanal/

## Estructura

```
menu-semanal/
├── backend/
│   ├── app.py            # FastAPI + endpoints + sirve el frontend
│   ├── db.py             # SQLite + esquema
│   ├── seed.py           # alimentos con macros + menú base
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   └── assets/
│       ├── css/styles.css
│       └── js/
│           ├── api.js          # cliente HTTP
│           ├── fallback-data.js # datos para Pages
│           └── app.js          # lógica + drawer
└── README.md
```

## Cómo correrlo local

Requiere **Python 3.10+**.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Abre http://localhost:8000

La primera vez se crea `backend/menu.db` y se siembra con ~50 alimentos y dos semanas de menú base.

### Reset de la base
```bash
curl -X POST http://localhost:8000/api/seed/reset
```
o borra `backend/menu.db` y reinicia.

## Endpoints API

| Método | Ruta                          | Descripción                       |
|--------|-------------------------------|-----------------------------------|
| GET    | `/api/health`                 | ping                              |
| GET    | `/api/alimentos?q=`           | catálogo (filtro opcional)        |
| POST   | `/api/alimentos`              | crear alimento                    |
| GET    | `/api/menu?desde=&hasta=`     | items del menú entre fechas       |
| POST   | `/api/menu`                   | añadir item                       |
| PUT    | `/api/menu/{id}`              | editar cantidad o alimento        |
| DELETE | `/api/menu/{id}`              | eliminar item                     |
| POST   | `/api/seed/reset`             | recargar seed                     |

Docs interactivas: http://localhost:8000/docs

## Modelo

- **alimentos**: catálogo reutilizable. Cada alimento tiene macros por porción.
- **menu_items**: cada fila es _un alimento dentro de una comida de un día_. Una comida (desayuno/almuerzo/merienda/cena) puede tener varios items.

Las macros se calculan al vuelo: `(cantidad_g / porcion_g) × valor_macro`.

## Stack

- Backend: **FastAPI 0.115** + **SQLite** (sin ORM, SQL directo).
- Frontend: HTML + CSS + JS vanilla. Sin build step. Inter font vía CDN.
- Sin Docker (todo nativo). Si más adelante quieres dockerizar, está pensado para que sea trivial.

## Roadmap sugerido

- [ ] Lista de la compra auto-generada (suma `cantidad_g` por alimento de la semana)
- [ ] Objetivos diarios (kcal/macros) y barras de progreso
- [ ] Plantillas reutilizables (copiar semana, duplicar día)
- [ ] Importar/exportar JSON
- [ ] Backend en producción (Render/Railway) para que la versión online también persista

---

Repo: https://github.com/crisgomeziba/menu-semanal
