from datetime import timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel,field_validator
from typing import Optional, Union
from src.database import get_connection

router = APIRouter()


class CitaIn(BaseModel):
    id_mascota: Union[int, str]
    id_veterinario: Union[int, str]
    fecha: str
    hora: str
    motivo: str
    estado: Optional[str] = "PENDIENTE"
    @field_validator("id_mascota", "id_veterinario", mode="before")
    @classmethod
    def validar_ids(cls, v):
        try:
            return int(v)
        except (ValueError, TypeError):
            raise ValueError("Debe seleccionar una opción válida.")

    @field_validator("motivo")
    @classmethod
    def validar_motivo(cls, v):
        if not v or not v.strip():
            raise ValueError("El motivo no puede estar vacío.")
        return v.strip()

def formatear_hora(valor):
    """Convierte timedelta (TIME de MySQL) a string 'HH:MM:SS'."""
    if valor is None:
        return None
    if isinstance(valor, timedelta):
        total_segundos = int(valor.total_seconds())
        horas = total_segundos // 3600
        minutos = (total_segundos % 3600) // 60
        segundos = total_segundos % 60
        return f"{horas:02d}:{minutos:02d}:{segundos:02d}"
    return str(valor)


def formatear_fecha(valor):
    """Convierte date/datetime de MySQL a string 'YYYY-MM-DD'."""
    if valor is None:
        return None
    if hasattr(valor, "isoformat"):
        return valor.isoformat()
    return str(valor)


@router.get("/")
def listar_citas():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                c.id_cita, c.id_mascota, c.id_veterinario, c.fecha, c.hora, c.motivo, c.estado,
                m.nombre AS mascota, d.nombre AS dueno, v.nombre AS veterinario
            FROM citas c
            INNER JOIN mascotas m ON c.id_mascota = m.id_mascota
            INNER JOIN duenos d ON m.id_dueno = d.id_dueno
            INNER JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            ORDER BY c.fecha DESC
            """
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        for row in rows:
            row["fecha"] = formatear_fecha(row["fecha"])
            row["hora"] = formatear_hora(row["hora"])

        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/")
def registrar_cita(data: CitaIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO citas
            (id_mascota, id_veterinario, fecha, hora, motivo)
            VALUES (%s, %s, %s, %s, %s)""",
            (data.id_mascota, data.id_veterinario, data.fecha, data.hora, data.motivo),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Cita registrada"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{id_cita}")
def actualizar_cita(id_cita: int, data: CitaIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE citas
            SET id_mascota=%s, id_veterinario=%s, fecha=%s, hora=%s, motivo=%s, estado=%s
            WHERE id_cita=%s""",
            (
                data.id_mascota,
                data.id_veterinario,
                data.fecha,
                data.hora,
                data.motivo,
                data.estado or "PENDIENTE",
                id_cita,
            ),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Cita actualizada completamente"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{id_cita}")
def eliminar_cita(id_cita: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM citas WHERE id_cita=%s", (id_cita,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Cita eliminada"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/dueno/{id_dueno}")
def obtener_citas_por_dueno(id_dueno: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                c.id_cita, c.fecha, c.hora, c.motivo, c.estado,
                m.nombre AS mascota, v.nombre AS veterinario
            FROM citas c
            INNER JOIN mascotas m ON c.id_mascota = m.id_mascota
            INNER JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            WHERE m.id_dueno = %s
            ORDER BY c.fecha DESC, c.hora DESC
            """,
            (id_dueno,),
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        for row in rows:
            row["fecha"] = formatear_fecha(row["fecha"])
            row["hora"] = formatear_hora(row["hora"])

        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))