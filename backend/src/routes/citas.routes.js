const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar citas
router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                c.id_cita,
                c.fecha,
                c.hora,
                c.motivo,
                c.estado,

                m.nombre AS mascota,
                d.nombre AS dueno,
                v.nombre AS veterinario

            FROM citas c

            INNER JOIN mascotas m
                ON c.id_mascota = m.id_mascota

            INNER JOIN duenos d
                ON m.id_dueno = d.id_dueno

            INNER JOIN veterinarios v
                ON c.id_veterinario = v.id_veterinario

            ORDER BY c.fecha DESC
        `);

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// Registrar cita
router.post("/", async (req, res) => {

    try {

        const {
            id_mascota,
            id_veterinario,
            fecha,
            hora,
            motivo
        } = req.body;

        await db.query(`
            INSERT INTO citas
            (
                id_mascota,
                id_veterinario,
                fecha,
                hora,
                motivo
            )
            VALUES (?, ?, ?, ?, ?)
        `,
        [
            id_mascota,
            id_veterinario,
            fecha,
            hora,
            motivo
        ]);

        res.json({
            mensaje: "Cita registrada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// Actualizar estado
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        await db.query(
            "UPDATE citas SET estado=? WHERE id_cita=?",
            [estado, id]
        );

        res.json({
            mensaje: "Estado actualizado"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// Eliminar cita
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM citas WHERE id_cita=?",
            [id]
        );

        res.json({
            mensaje: "Cita eliminada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;