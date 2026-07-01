require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http"); 
const { Server } = require("socket.io"); 
const db = require("./db");

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const duenosRoutes = require("./routes/duenos.routes");
const mascotasRoutes = require("./routes/mascotas.routes");
const veterinariosRoutes = require("./routes/veterinarios.routes");
const citasRoutes = require("./routes/citas.routes");

app.use(cors());
app.use(express.json());
app.use("/duenos", duenosRoutes);
app.use("/mascotas", mascotasRoutes);
app.use("/veterinarios", veterinariosRoutes);
app.use("/citas", citasRoutes);

// 📬 ENDPOINT API: Bandeja estilo WhatsApp real desde MySQL
app.get("/chats/bandeja", async (req, res) => {
    try {
        // Seleccionamos el último mensaje de cada dueño usando tu columna 'id' y 'fecha'
        const [rows] = await db.query(`
            SELECT m.id_dueno, d.nombre AS nombre_cliente, m.mensaje AS ultimo_mensaje, 
                   m.fecha AS tiempo, m.remitente,
                   (SELECT COUNT(*) FROM mensajes WHERE id_dueno = m.id_dueno AND remitente = 'CLIENTE') AS no_leidos
            FROM mensajes m
            INNER JOIN duenos d ON m.id_dueno = d.id_dueno
            WHERE m.id IN (
                SELECT MAX(id) 
                FROM mensajes 
                GROUP BY id_dueno
            )
            ORDER BY m.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error al cargar la bandeja real:", error);
        res.status(500).json({ error: error.message });
    }
});

// 📬 ENDPOINT API: Obtener la conversación específica desde MySQL
app.get("/chats/conversacion/:id_dueno", async (req, res) => {
    try {
        const idDueno = parseInt(req.params.id_dueno);
        // Traemos el historial ordenado cronológicamente por tu id autoincremental
        const [rows] = await db.query(
            "SELECT id_dueno, remitente, mensaje, fecha FROM mensajes WHERE id_dueno = ? ORDER BY id ASC",
            [idDueno]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al recuperar conversación desde la BD:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS fecha");
        res.json({
            mensaje: "API y WebSockets conectados a MySQL de forma segura",
            servidor: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 🔌 LÓGICA DE WEBSONCKETS EN TIEMPO REAL CON PERSISTENCIA
io.on("connection", (socket) => {
    console.log(`📡 Dispositivo conectado al chat: ${socket.id}`);

    socket.on("unirse_chat", (id_dueno) => {
        socket.join(`sala_${id_dueno}`);
    });

    socket.on("enviar_mensaje", async (datos) => {
        try {
            // 1. Guardar en la Base de Datos Real de MySQL 💾
            await db.query(
                "INSERT INTO mensajes (id_dueno, remitente, mensaje) VALUES (?, ?, ?)", 
                [datos.id_dueno, datos.remitente, datos.mensaje.trim()]
            );

            // 2. Estructurar el objeto para la transmisión inmediata
            const mensajeParaEnviar = {
                id_dueno: datos.id_dueno,
                nombre_cliente: datos.nombre_cliente || "Usuario",
                remitente: datos.remitente,
                mensaje: datos.mensaje.trim(),
                fecha: new Date()
            };

            // 3. Retransmitir por Sockets a la sala correspondiente 📡
            io.to(`sala_${datos.id_dueno}`).emit("recibir_mensaje", mensajeParaEnviar);
            io.emit("actualizar_bandeja_admin");

        } catch (error) {
            console.error("❌ Error crítico guardando mensaje en MySQL:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔌 Dispositivo desconectado: ${socket.id}`);
    });
});

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Conexión exitosa a la nube de tu compañero");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
})();

server.listen(3000, () => {
    console.log("Servidor híbrido seguro ejecutándose en el puerto 3000");
});