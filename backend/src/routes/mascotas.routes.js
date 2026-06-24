const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todas las mascotas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        m.*,
        d.nombre AS dueno
      FROM mascotas m
      INNER JOIN duenos d
      ON m.id_dueno = d.id_dueno
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Registrar mascota
router.post("/", async (req, res) => {

  try {

    const {
      nombre,
      especie,
      raza,
      edad,
      id_dueno
    } = req.body;

    await db.query(
      `INSERT INTO mascotas
      (nombre, especie, raza, edad, id_dueno)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, especie, raza, edad, id_dueno]
    );

    res.json({
      mensaje: "Mascota registrada"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// Actualizar mascota
router.put("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      especie,
      raza,
      edad,
      id_dueno
    } = req.body;

    await db.query(
      `UPDATE mascotas
       SET nombre=?,
           especie=?,
           raza=?,
           edad=?,
           id_dueno=?
       WHERE id_mascota=?`,
      [
        nombre,
        especie,
        raza,
        edad,
        id_dueno,
        id
      ]
    );

    res.json({
      mensaje: "Mascota actualizada"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// Eliminar mascota
router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM mascotas WHERE id_mascota=?",
      [id]
    );

    res.json({
      mensaje: "Mascota eliminada"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// Obtener mascotas de un dueño en específico (Para el Cliente Logueado)
router.get("/dueno/:id_dueno", async (req, res) => {
  try {
    const { id_dueno } = req.params;

    const [rows] = await db.query(
      "SELECT id_mascota, nombre, especie, raza, edad FROM mascotas WHERE id_dueno = ?",
      [id_dueno]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;