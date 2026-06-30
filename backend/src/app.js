require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http"); // 👈 Para acoplar Socket.io
const { Server } = require("socket.io"); // 👈 Sockets
const db = require("./db");

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 🧠 BASE DE DATOS TEMPORAL EN MEMORIA (No romperá nada y emula el chat a la perfección)
let mensajesTemporales = [];

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

// 📬 ENDPOINT API: Estructura simulada para la bandeja estilo WhatsApp del admin
app.get("/chats/bandeja", (req, res) => {
    // Agrupamos el último mensaje de memoria por cada dueño de forma dinámica
    const bandeja = [];
    const duenosProcesados = new Set();

    // Recorremos al revés para obtener los últimos mensajes primero
    for (let i = mensajesTemporales.length - 1; i >= 0; i--) {
        const msg = mensajesTemporales[i];
        if (!duenosProcesados.has(msg.id_dueno)) {
            duenosProcesados.add(msg.id_dueno);
            bandeja.push({
                id_dueno: msg.id_dueno,
                nombre_cliente: msg.nombre_cliente,
                ultimo_mensaje: msg.mensaje,
                tiempo: msg.fecha,
                remitente: msg.remitente,
                no_leidos: msg.remitente === 'CLIENTE' ? 1 : 0 // Simulación rápida
            });
        }
    }
    res.json(bandeja);
});

// 📬 NUEVO ENDPOINT: Obtener los mensajes específicos de un solo dueño
app.get("/chats/conversacion/:id_dueno", (req, res) => {
    const idDueno = parseInt(req.params.id_dueno);
    const historial = mensajesTemporales.filter(msg => msg.id_dueno === idDueno);
    res.json(historial);
});

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS fecha");
        res.json({
            mensaje: "API y WebSockets en memoria funcionando de forma segura",
            servidor: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 🔌 LÓGICA DE SOCKETS (Sin consultas SQL)
io.on("connection", (socket) => {
    console.log(`📡 Dispositivo conectado al chat: ${socket.id}`);

    socket.on("unirse_chat", (id_dueno) => {
        socket.join(`sala_${id_dueno}`);
    });

    socket.on("enviar_mensaje", (datos) => {
        const nuevoMensaje = {
            id_dueno: datos.id_dueno,
            nombre_cliente: datos.nombre_cliente || "Usuario",
            remitente: datos.remitente,
            mensaje: datos.mensaje,
            fecha: new Date()
        };

        // Guardamos en el almacén de memoria temporal
        mensajesTemporales.push(nuevoMensaje);

        // Retransmitimos en tiempo real
        io.to(`sala_${datos.id_dueno}`).emit("recibir_mensaje", nuevoMensaje);
        io.emit("actualizar_bandeja_admin");
    });

    socket.on("disconnect", () => {
        console.log(`🔌 Dispositivo desconectado: ${socket.id}`);
    });
});

(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Conexión exitosa a la nube de tu compañero");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
})();

// Escuchamos desde server
server.listen(3000, () => {
    console.log("Servidor híbrido seguro ejecutándose en el puerto 3000");
});