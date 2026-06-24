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
// Actualizar veterinario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, correo, telefono } = req.body;

    await db.query(
      `UPDATE veterinarios 
       SET nombre=?, especialidad=?, correo=?, telefono=? 
       WHERE id_veterinario=?`,
      [nombre, especialidad, correo, telefono, id]
    );

    res.json({ mensaje: "Veterinario actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar veterinario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM veterinarios WHERE id_veterinario=?",
      [id]
    );

    res.json({ mensaje: "Veterinario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;