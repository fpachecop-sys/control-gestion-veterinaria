const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar veterinarios
router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM veterinarios"
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// Registrar veterinario
router.post("/", async (req, res) => {

  try {

    const {
      nombre,
      especialidad,
      correo,
      telefono
    } = req.body;

    await db.query(
      `INSERT INTO veterinarios
      (nombre, especialidad, correo, telefono)
      VALUES (?, ?, ?, ?)`,
      [
        nombre,
        especialidad,
        correo,
        telefono
      ]
    );

    res.json({
      mensaje: "Veterinario registrado"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;