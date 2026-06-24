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

// Registrar o Vincular dueño (Maneja Admin y Registro de Usuario de forma inteligente)
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            dni,
            telefono,
            direccion,
            correo,      // Viene desde la pantalla "Crear Cuenta"
            contrasena   // Viene desde la pantalla "Crear Cuenta"
        } = req.body;

        // 1. Desestructuramos como [rows] para obtener el array de resultados directo de MySQL
        const [rows] = await db.query(
            "SELECT * FROM duenos WHERE dni = ?",
            [dni]
        );

        // 2. Evaluamos correctamente la longitud de las filas encontradas
        if (rows.length > 0) {
            // 🚀 CASO A: El admin ya lo creó en la clínica.
            // Vinculamos su cuenta agregando el correo y la contraseña al registro que ya existía.
            await db.query(
                `UPDATE duenos 
                 SET correo = ?, 
                     contrasena = ?, 
                     telefono = COALESCE(?, telefono), 
                     direccion = COALESCE(?, direccion) 
                 WHERE dni = ?`,
                [correo || null, contrasena || null, telefono, direccion, dni]
            );

            return res.json({
                mensaje: "Cuenta vinculada con éxito. ¡Tus datos y mascotas están listos!"
            });

        } else {
            // 📝 CASO B: Es un cliente totalmente nuevo que se está registrando por su cuenta.
            // Creamos el registro completo desde cero.
            await db.query(
                `INSERT INTO duenos
                (nombre, dni, telefono, direccion, correo, contrasena)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, dni, telefono, direccion || null, correo || null, contrasena || null]
            );

            return res.json({
                mensaje: "Dueño registrado"
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Endpoint para el Inicio de Sesión de Clientes (Login Real)
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 🌟 Cambiamos 'id' por 'id_dueno' para que coincida exactamente con tu base de datos
        const [rows] = await db.query(
            "SELECT id_dueno, nombre, dni, telefono, direccion FROM duenos WHERE correo = ? AND contrasena = ?",
            [correo, contrasena]
        );

        // Si no encuentra ninguna coincidencia
        if (rows.length === 0) {
            return res.status(401).json({
                error: "El correo electrónico o la contraseña son incorrectos."
            });
        }

        // Si es correcto, devolvemos la información del usuario para guardarla en el Frontend
        res.json({
            mensaje: "Login exitoso",
            usuario: rows[0]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// Actualizar dueño por ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, dni, telefono, direccion } = req.body;

        await db.query(
            `UPDATE duenos 
             SET nombre = ?, dni = ?, telefono = ?, direccion = ? 
             WHERE id_dueno = ?`,
            [nombre, dni, telefono, direccion, id]
        );

        res.json({ mensaje: "Dueño actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar dueño por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM duenos WHERE id_dueno = ?", [id]);

        res.json({ mensaje: "Dueño eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;