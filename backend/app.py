"""FastAPI app: API + serve frontend estático."""
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from db import cursor, init_db
import seed

ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT / "frontend"

app = FastAPI(title="Menú Semanal API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Modelos ---
class Alimento(BaseModel):
    id: int
    nombre: str
    categoria: Optional[str] = None
    porcion_g: float
    kcal: float
    carbs_g: float
    proteina_g: float
    grasa_g: float
    emoji: Optional[str] = None


class AlimentoCreate(BaseModel):
    nombre: str
    categoria: Optional[str] = None
    porcion_g: float = 100
    kcal: float
    carbs_g: float
    proteina_g: float
    grasa_g: float
    emoji: Optional[str] = "🍽️"


class MenuItem(BaseModel):
    id: int
    fecha: str
    comida: str
    alimento_id: int
    cantidad_g: float
    orden: int
    alimento: Alimento


class MenuItemCreate(BaseModel):
    fecha: str
    comida: str = Field(pattern="^(desayuno|almuerzo|merienda|cena)$")
    alimento_id: int
    cantidad_g: float = 100
    orden: int = 0


class MenuItemUpdate(BaseModel):
    cantidad_g: Optional[float] = None
    alimento_id: Optional[int] = None


# --- Helpers ---
def row_to_alimento(r) -> Alimento:
    return Alimento(**dict(r))


def calc_macros(item_row, alimento_row):
    factor = item_row["cantidad_g"] / alimento_row["porcion_g"]
    return {
        "kcal": round(alimento_row["kcal"] * factor, 1),
        "carbs_g": round(alimento_row["carbs_g"] * factor, 1),
        "proteina_g": round(alimento_row["proteina_g"] * factor, 1),
        "grasa_g": round(alimento_row["grasa_g"] * factor, 1),
    }


# --- Endpoints API ---
@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/alimentos")
def list_alimentos(q: Optional[str] = None):
    with cursor() as conn:
        if q:
            rows = conn.execute(
                "SELECT * FROM alimentos WHERE nombre LIKE ? ORDER BY nombre",
                (f"%{q}%",),
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM alimentos ORDER BY categoria, nombre").fetchall()
        return [dict(r) for r in rows]


@app.post("/api/alimentos")
def create_alimento(payload: AlimentoCreate):
    with cursor() as conn:
        try:
            cur = conn.execute("""
                INSERT INTO alimentos (nombre, categoria, porcion_g, kcal, carbs_g, proteina_g, grasa_g, emoji)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (payload.nombre, payload.categoria, payload.porcion_g, payload.kcal,
                  payload.carbs_g, payload.proteina_g, payload.grasa_g, payload.emoji))
            new_id = cur.lastrowid
        except Exception as e:
            raise HTTPException(400, f"No se pudo crear: {e}")
        row = conn.execute("SELECT * FROM alimentos WHERE id = ?", (new_id,)).fetchone()
        return dict(row)


@app.get("/api/menu")
def get_menu(desde: str, hasta: str):
    """Items de menú entre dos fechas (YYYY-MM-DD), inclusive."""
    with cursor() as conn:
        rows = conn.execute("""
            SELECT mi.*, a.nombre, a.categoria, a.porcion_g, a.kcal, a.carbs_g,
                   a.proteina_g, a.grasa_g, a.emoji
            FROM menu_items mi
            JOIN alimentos a ON a.id = mi.alimento_id
            WHERE mi.fecha BETWEEN ? AND ?
            ORDER BY mi.fecha, mi.comida, mi.orden, mi.id
        """, (desde, hasta)).fetchall()

        result = []
        for r in rows:
            macros = calc_macros(r, r)  # fila tiene ambos campos
            result.append({
                "id": r["id"],
                "fecha": r["fecha"],
                "comida": r["comida"],
                "alimento_id": r["alimento_id"],
                "cantidad_g": r["cantidad_g"],
                "orden": r["orden"],
                "alimento": {
                    "id": r["alimento_id"],
                    "nombre": r["nombre"],
                    "categoria": r["categoria"],
                    "porcion_g": r["porcion_g"],
                    "kcal": r["kcal"],
                    "carbs_g": r["carbs_g"],
                    "proteina_g": r["proteina_g"],
                    "grasa_g": r["grasa_g"],
                    "emoji": r["emoji"],
                },
                "macros": macros,
            })
        return result


@app.post("/api/menu")
def add_menu_item(payload: MenuItemCreate):
    with cursor() as conn:
        ali = conn.execute("SELECT id FROM alimentos WHERE id = ?", (payload.alimento_id,)).fetchone()
        if not ali:
            raise HTTPException(404, "Alimento no encontrado")
        cur = conn.execute("""
            INSERT INTO menu_items (fecha, comida, alimento_id, cantidad_g, orden)
            VALUES (?, ?, ?, ?, ?)
        """, (payload.fecha, payload.comida, payload.alimento_id, payload.cantidad_g, payload.orden))
        return {"id": cur.lastrowid, "ok": True}


@app.put("/api/menu/{item_id}")
def update_menu_item(item_id: int, payload: MenuItemUpdate):
    with cursor() as conn:
        existing = conn.execute("SELECT * FROM menu_items WHERE id = ?", (item_id,)).fetchone()
        if not existing:
            raise HTTPException(404, "Item no encontrado")
        cantidad = payload.cantidad_g if payload.cantidad_g is not None else existing["cantidad_g"]
        ali_id = payload.alimento_id if payload.alimento_id is not None else existing["alimento_id"]
        conn.execute(
            "UPDATE menu_items SET cantidad_g = ?, alimento_id = ? WHERE id = ?",
            (cantidad, ali_id, item_id),
        )
        return {"ok": True}


@app.delete("/api/menu/{item_id}")
def delete_menu_item(item_id: int):
    with cursor() as conn:
        conn.execute("DELETE FROM menu_items WHERE id = ?", (item_id,))
        return {"ok": True}


@app.post("/api/seed/reset")
def reset_seed():
    """Recarga el seed (alimentos + menú de esta semana y la siguiente)."""
    with cursor() as conn:
        conn.execute("DELETE FROM menu_items")
    seed.run()
    return {"ok": True, "msg": "Base reseteada con seed"}


# --- Servir frontend ---
@app.get("/")
def root_index():
    return FileResponse(FRONTEND_DIR / "index.html")


app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")


@app.on_event("startup")
def on_startup():
    init_db()
    # Si la base está vacía, sembrarla
    with cursor() as conn:
        count = conn.execute("SELECT COUNT(*) AS c FROM alimentos").fetchone()["c"]
    if count == 0:
        print("Base vacía, ejecutando seed inicial...")
        seed.run()
