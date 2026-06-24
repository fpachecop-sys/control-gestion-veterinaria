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
// Actualizar todos los datos de la cita
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_mascota,
            id_veterinario,
            fecha,
            hora,
            motivo,
            estado // Mantenemos el estado por si viene en el cuerpo, o puedes dejarlo igual
        } = req.body;

        await db.query(
            `UPDATE citas 
             SET id_mascota=?, id_veterinario=?, fecha=?, hora=?, motivo=?, estado=? 
             WHERE id_cita=?`,
            [
                id_mascota, 
                id_veterinario, 
                fecha, 
                hora, 
                motivo, 
                estado || 'PENDIENTE', // Si no se altera, conserva PENDIENTE
                id
            ]
        );

        res.json({ mensaje: "Cita actualizada completamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Obtener citas de un dueño en específico (Para el Cliente Logueado)
router.get("/dueno/:id_dueno", async (req, res) => {
    try {
        const { id_dueno } = req.params;

        const [rows] = await db.query(`
            SELECT
                c.id_cita,
                c.fecha,
                c.hora,
                c.motivo,
                c.estado,
                m.nombre AS mascota,
                v.nombre AS veterinario
            FROM citas c
            INNER JOIN mascotas m ON c.id_mascota = m.id_mascota
            INNER JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            WHERE m.id_dueno = ?
            ORDER BY c.fecha DESC, c.hora DESC
        `, [id_dueno]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;