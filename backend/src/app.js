require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
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

app.get("/", async (req, res) => {
    try {

        const [rows] = await db.query("SELECT NOW() AS fecha");

        res.json({
            mensaje: "API Veterinaria funcionando",
            servidor: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Conexión exitosa");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
})();
app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});