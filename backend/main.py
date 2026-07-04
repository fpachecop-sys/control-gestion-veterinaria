import os
from datetime import datetime

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import get_connection
from src.routes import duenos, mascotas, veterinarios, citas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(duenos.router, prefix="/duenos")
app.include_router(mascotas.router, prefix="/mascotas")
app.include_router(veterinarios.router, prefix="/veterinarios")
app.include_router(citas.router, prefix="/citas")


@app.get("/")
def root():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT NOW() AS fecha")
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return {
            "mensaje": "API y WebSockets conectados a MySQL de forma segura",
            "servidor": row,
        }
    except Exception as error:
        return {"error": str(error)}


@app.get("/chats/bandeja")
def bandeja_chats():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT m.id_dueno, d.nombre AS nombre_cliente, m.mensaje AS ultimo_mensaje,
                   m.fecha AS tiempo, m.remitente,
                   (SELECT COUNT(*) FROM mensajes 
                   WHERE id_dueno = m.id_dueno AND remitente = 'CLIENTE' AND leido = 0) AS no_leidos
            FROM mensajes m
            INNER JOIN duenos d ON m.id_dueno = d.id_dueno
            WHERE m.id IN (
                SELECT MAX(id) FROM mensajes GROUP BY id_dueno
            )
            ORDER BY d.nombre ASC
            """
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        return {"error": str(error)}


@app.get("/chats/conversacion/{id_dueno}")
def conversacion(id_dueno: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_dueno, remitente, mensaje, fecha FROM mensajes WHERE id_dueno = %s ORDER BY id ASC",
            (id_dueno,),
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as error:
        return {"error": str(error)}


# ==========================
# 🔌 SOCKET.IO (equivalente a socket.io de Express)
# ==========================
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")


@sio.event
async def connect(sid, environ):
    print(f"📡 Dispositivo conectado al chat: {sid}")


@sio.event
async def disconnect(sid):
    print(f"🔌 Dispositivo desconectado: {sid}")


@sio.on("unirse_chat")
async def unirse_chat(sid, id_dueno):
    await sio.enter_room(sid, f"sala_{id_dueno}")


@sio.on("enviar_mensaje")
async def enviar_mensaje(sid, datos):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO mensajes (id_dueno, remitente, mensaje) VALUES (%s, %s, %s)",
            (datos["id_dueno"], datos["remitente"], datos["mensaje"].strip()),
        )
        conn.commit()
        cursor.close()
        conn.close()

        mensaje_para_enviar = {
            "id_dueno": datos["id_dueno"],
            "nombre_cliente": datos.get("nombre_cliente", "Usuario"),
            "remitente": datos["remitente"],
            "mensaje": datos["mensaje"].strip(),
            "fecha": datetime.now().isoformat(),
        }

        await sio.emit(
            "recibir_mensaje", mensaje_para_enviar, room=f"sala_{datos['id_dueno']}"
        )
        await sio.emit("actualizar_bandeja_admin")

    except Exception as error:
        print(f"❌ Error crítico guardando mensaje en MySQL: {error}")


socket_app = socketio.ASGIApp(sio, other_asgi_app=app)


@app.on_event("startup")
async def startup_event():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchall()  # 👈 IMPORTANTE: consumir el resultado
        cursor.close()
        conn.close()
        print("✅ Conexión exitosa a la base de datos")
    except Exception as error:
        print(f"❌ Error de conexión: {error}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(socket_app, host="0.0.0.0", port=8000)