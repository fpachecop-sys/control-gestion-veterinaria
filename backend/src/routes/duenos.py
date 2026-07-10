import os
import random
import string
import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from typing import Optional, Union
import bcrypt
import re

from src.database import get_connection

router = APIRouter()

SALT_ROUNDS = 10


def enviar_correo(destino: str, asunto: str, html: str):
    try:
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")

        msg = MIMEText(html, "html")
        msg["Subject"] = asunto
        msg["From"] = f"Veterinaria Mascotas <{email_user}>"
        msg["To"] = destino

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(email_user, email_pass)
            server.sendmail(email_user, destino, msg.as_string())
        print(f"📧 Correo enviado con éxito a: {destino}")
    except Exception as error:
        print(f"❌ Error enviando correo: {error}")


from typing import Optional, Union
import re
from pydantic import BaseModel, field_validator


class DuenoIn(BaseModel):
    nombre: Optional[str] = None
    dni: Union[str, int]
    telefono: Optional[Union[str, int]] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
    contrasena: Optional[str] = None

    @field_validator("dni", mode="before")
    @classmethod
    def validar_dni(cls, v):
        if v is None:
            raise ValueError("El DNI es obligatorio.")
        v = str(v).strip()
        if not v.isdigit():
            raise ValueError("El DNI debe contener solo números.")
        if len(v) != 8:
            raise ValueError("El DNI debe tener exactamente 8 dígitos.")
        return v

    @field_validator("telefono", mode="before")
    @classmethod
    def validar_telefono(cls, v):
        if v is None or v == "":
            return None
        v = str(v).strip()
        if not v.isdigit():
            raise ValueError("El teléfono debe contener solo números.")
        if len(v) != 9:
            raise ValueError("El teléfono debe tener exactamente 9 dígitos.")
        return v

    @field_validator("correo", mode="before")
    @classmethod
    def validar_correo(cls, v):
        if v is None or v == "":
            return None
        v = str(v).strip()
        patron = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(patron, v):
            raise ValueError("El correo electrónico no es válido.")
        return v


class LoginIn(BaseModel):
    correo: str
    contrasena: str


class RecuperarIn(BaseModel):
    correo: str


@router.get("/")
def listar_duenos():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo FROM duenos"
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/")
def registrar_o_vincular_dueno(data: DuenoIn):
    try:
        if not data.dni:
            raise HTTPException(status_code=400, detail="El DNI es obligatorio.")

        contrasena_encriptada = None
        if data.contrasena:
            contrasena_encriptada = bcrypt.hashpw(
                data.contrasena.encode(), bcrypt.gensalt(SALT_ROUNDS)
            ).decode()

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM duenos WHERE dni = %s", (data.dni,))
        rows = cursor.fetchall()

        if rows:
            dueno_existente = rows[0]
            cursor.execute(
                """UPDATE duenos
                SET correo = %s,
                    contrasena = %s,
                    telefono = COALESCE(%s, telefono),
                    direccion = COALESCE(%s, direccion)
                WHERE dni = %s""",
                (
                    data.correo or None,
                    contrasena_encriptada,
                    data.telefono or None,
                    data.direccion or None,
                    data.dni,
                ),
            )
            conn.commit()
            cursor.close()
            conn.close()

            if data.correo:
                html = f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2c3e50; text-align: center;">¡Tu cuenta ha sido vinculada! 🏥</h2>
                    <p>Hola <strong>{dueno_existente['nombre']}</strong>,</p>
                    <p>Te damos la bienvenida formal a la app móvil de <strong>Mascotas Portalino y Rondón</strong>.</p>
                    <p>Hemos vinculado con éxito tus datos veterinarios usando tu DNI (<strong>{data.dni}</strong>).</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">Veterinaria Mascotas Portalino y Rondón</p>
                </div>
                """
                enviar_correo(data.correo, "¡Cuenta Vinculada con Éxito! - Veterinaria", html)

            return {"mensaje": "Cuenta vinculada con éxito. ¡Tus datos y mascotas están listos!"}

        else:
            cursor.execute(
                """INSERT INTO duenos (nombre, dni, telefono, direccion, correo, contrasena)
                VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    data.nombre,
                    data.dni,
                    data.telefono,
                    data.direccion or None,
                    data.correo or None,
                    contrasena_encriptada,
                ),
            )
            conn.commit()
            cursor.close()
            conn.close()

            if data.correo:
                html = f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #27ae60; text-align: center;">¡Bienvenido a la Veterinaria! 🐾</h2>
                    <p>Hola <strong>{data.nombre}</strong>,</p>
                    <p>Tu cuenta ha sido creada exitosamente en nuestro sistema.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center; color: #7f8c8d;">Veterinaria Mascotas Portalino y Rondón</p>
                </div>
                """
                enviar_correo(data.correo, "¡Bienvenido a Mascotas Portalino y Rondón!", html)

            return {"mensaje": "Dueño registrado"}

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{id_dueno}")
def actualizar_dueno(id_dueno: int, data: DuenoIn):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query_contrasena = ""
        parametros = [data.nombre, data.dni, data.telefono, data.direccion or None, data.correo or None]

        if data.contrasena and data.contrasena.strip() != "":
            contrasena_encriptada = bcrypt.hashpw(
                data.contrasena.encode(), bcrypt.gensalt(SALT_ROUNDS)
            ).decode()
            query_contrasena = ", contrasena = %s"
            parametros.append(contrasena_encriptada)

        parametros.append(id_dueno)

        cursor.execute(
            f"""UPDATE duenos
            SET nombre = %s, dni = %s, telefono = %s, direccion = %s, correo = %s
            {query_contrasena}
            WHERE id_dueno = %s""",
            tuple(parametros),
        )
        conn.commit()

        cursor.execute(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo FROM duenos WHERE id_dueno = %s",
            (id_dueno,),
        )
        usuario = cursor.fetchone()
        cursor.close()
        conn.close()

        return {"mensaje": "Perfil actualizado con éxito", "usuario": usuario}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/login")
def login(data: LoginIn):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo, contrasena FROM duenos WHERE correo = %s",
            (data.correo,),
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        if not rows:
            raise HTTPException(
                status_code=401, detail="El correo electrónico o la contraseña son incorrectos."
            )

        usuario = rows[0]
        contrasena_correcta = bcrypt.checkpw(
            data.contrasena.encode(), usuario["contrasena"].encode()
        )

        if not contrasena_correcta:
            raise HTTPException(
                status_code=401, detail="El correo electrónico o la contraseña son incorrectos."
            )

        del usuario["contrasena"]

        return {"mensaje": "Login exitoso", "usuario": usuario}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/recuperar-contrasena")
def recuperar_contrasena(data: RecuperarIn):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_dueno, nombre FROM duenos WHERE correo = %s", (data.correo,)
        )
        rows = cursor.fetchall()

        if not rows:
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=404,
                detail="No encontramos ninguna cuenta asociada a este correo electrónico.",
            )

        usuario = rows[0]
        clave_temporal = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=8)
        )
        hash_temporal = bcrypt.hashpw(
            clave_temporal.encode(), bcrypt.gensalt(SALT_ROUNDS)
        ).decode()

        cursor.execute(
            "UPDATE duenos SET contrasena = %s WHERE id_dueno = %s",
            (hash_temporal, usuario["id_dueno"]),
        )
        conn.commit()
        cursor.close()
        conn.close()

        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #e67e22; text-align: center;">Recuperación de Contraseña Real 🔑</h2>
            <p>Hola <strong>{usuario['nombre']}</strong>,</p>
            <p>Hemos generado una contraseña de acceso temporal segura. Úsala para iniciar sesión y cámbiala de inmediato en tu perfil:</p>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 1.4rem; letter-spacing: 2px; border-radius: 5px; border: 1px dashed #e67e22; margin: 20px 0; font-family: monospace;">
                <strong>{clave_temporal}</strong>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">Mascotas Portalino y Rondón</p>
        </div>
        """
        enviar_correo(data.correo, "Restablecimiento de Credenciales - Veterinaria", html)

        return {"mensaje": "Se ha enviado un correo electrónico con tu nueva clave temporal de acceso."}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{id_dueno}")
def eliminar_dueno(id_dueno: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """SELECT COUNT(*) AS total
            FROM citas c
            INNER JOIN mascotas m ON c.id_mascota = m.id_mascota
            WHERE m.id_dueno = %s""",
            (id_dueno,),
        )
        total_citas = cursor.fetchone()["total"]

        if total_citas > 0:
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"No se puede eliminar al dueño. Sus mascotas tienen {total_citas} cita(s) registrada(s) en el historial clínico.",
            )

        cursor.execute("DELETE FROM duenos WHERE id_dueno = %s", (id_dueno,))
        conn.commit()
        cursor.close()
        conn.close()

        return {"mensaje": "Dueño y registros asociados eliminados con éxito."}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail="Error interno del servidor al eliminar.")


@router.post("/leer/{id_dueno}")
def marcar_leidos(id_dueno: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE mensajes
            SET leido = 1
            WHERE id_dueno = %s AND remitente = 'CLIENTE' AND leido = 0""",
            (id_dueno,),
        )
        conn.commit()
        cursor.close()
        conn.close()

        # Notificar por socket.io se hace en main.py si se requiere
        return {"mensaje": "Mensajes marcados como leídos con éxito."}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
