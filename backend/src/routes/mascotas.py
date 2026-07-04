from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from typing import Optional, Union
from src.database import get_connection

router = APIRouter()


class MascotaIn(BaseModel):
    nombre: str
    especie: str
    raza: Optional[str] = None
    edad: Optional[Union[int, str]] = None
    id_dueno: Union[int, str]

    @field_validator("edad", mode="before")
    @classmethod
    def validar_edad(cls, v):
        if v is None or v == "":
            return None
        try:
            edad = int(v)
        except (ValueError, TypeError):
            raise ValueError("La edad debe ser un número.")
        if edad < 0 or edad > 50:
            raise ValueError("La edad debe estar entre 0 y 50 años.")
        return edad

    @field_validator("id_dueno", mode="before")
    @classmethod
    def validar_id_dueno(cls, v):
        try:
            return int(v)
        except (ValueError, TypeError):
            raise ValueError("El dueño seleccionado no es válido.")


@router.get("/")
def listar_mascotas():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT m.*, d.nombre AS dueno
            FROM mascotas m
            INNER JOIN duenos d ON m.id_dueno = d.id_dueno
            """
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/")
def registrar_mascota(data: MascotaIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO mascotas
            (nombre, especie, raza, edad, id_dueno)
            VALUES (%s, %s, %s, %s, %s)""",
            (data.nombre, data.especie, data.raza, data.edad, data.id_dueno),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Mascota registrada"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{id_mascota}")
def actualizar_mascota(id_mascota: int, data: MascotaIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE mascotas
            SET nombre=%s, especie=%s, raza=%s, edad=%s, id_dueno=%s
            WHERE id_mascota=%s""",
            (data.nombre, data.especie, data.raza, data.edad, data.id_dueno, id_mascota),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Mascota actualizada"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{id_mascota}")
def eliminar_mascota(id_mascota: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM mascotas WHERE id_mascota=%s", (id_mascota,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"mensaje": "Mascota eliminada"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/dueno/{id_dueno}")
def obtener_mascotas_por_dueno(id_dueno: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_mascota, nombre, especie, raza, edad FROM mascotas WHERE id_dueno = %s",
            (id_dueno,),
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))