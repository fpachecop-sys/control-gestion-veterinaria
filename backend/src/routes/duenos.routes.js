const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar dueños
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM duenos"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Registrar dueño
router.post("/", async (req, res) => {

    try {

        const {
            nombre,
            dni,
            telefono,
            direccion
        } = req.body;

        await db.query(
            `INSERT INTO duenos
            (nombre,dni,telefono,direccion)
            VALUES (?,?,?,?)`,
            [nombre,dni,telefono,direccion]
        );

        res.json({
            mensaje: "Dueño registrado"
        });

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

module.exports = router;