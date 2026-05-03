"""SQLite setup + helpers."""
import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).parent / "menu.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS alimentos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL UNIQUE,
  categoria   TEXT,
  porcion_g   REAL NOT NULL DEFAULT 100,
  kcal        REAL NOT NULL,
  carbs_g     REAL NOT NULL,
  proteina_g  REAL NOT NULL,
  grasa_g     REAL NOT NULL,
  emoji       TEXT
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha        TEXT NOT NULL,
  comida       TEXT NOT NULL CHECK (comida IN ('desayuno','almuerzo','merienda','cena')),
  alimento_id  INTEGER NOT NULL,
  cantidad_g   REAL NOT NULL DEFAULT 100,
  orden        INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (alimento_id) REFERENCES alimentos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_menu_fecha ON menu_items(fecha);
"""


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def cursor():
    conn = get_conn()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with cursor() as conn:
        conn.executescript(SCHEMA)
