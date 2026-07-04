from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.database import get_connection

router = APIRouter()


class VeterinarioIn(BaseModel):
    nombre: str
    especialidad: str
    correo: str
    telefono: str


@router.get("/")
def listar_veterinarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM veterinarios")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/")
def registrar_veterinario(data: VeterinarioIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO veterinarios
            (nombre, especialidad, correo, telefono)
            VALUES (%s, %s, %s, %s)""",
            (data.nombre, data.especialidad, data.correo, data.telefono),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Veterinario registrado"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{id_veterinario}")
def actualizar_veterinario(id_veterinario: int, data: VeterinarioIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE veterinarios
            SET nombre=%s, especialidad=%s, correo=%s, telefono=%s
            WHERE id_veterinario=%s""",
            (data.nombre, data.especialidad, data.correo, data.telefono, id_veterinario),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Veterinario actualizado"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{id_veterinario}")
def eliminar_veterinario(id_veterinario: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM veterinarios WHERE id_veterinario=%s", (id_veterinario,)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Veterinario eliminado"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))