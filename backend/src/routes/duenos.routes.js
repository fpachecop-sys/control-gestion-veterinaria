const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const SALTRON_ROUNDS = 10;

// Configuración del transportador de Gmail para la veterinaria
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Helper para envío de correos en segundo plano
const enviarCorreoElectronico = async (destino, asunto, plantillaHtml) => {
    try {
        await transporter.sendMail({
            from: `"Veterinaria Mascotas" <${process.env.EMAIL_USER}>`,
            to: destino,
            subject: asunto,
            html: plantillaHtml
        });
        console.log(`📧 Correo enviado con éxito a: ${destino}`);
    } catch (error) {
        console.error("❌ Error enviando correo:", error);
    }
};

// Listar dueños
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id_dueno, nombre, dni, telefono, direccion, correo FROM duenos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar o Vincular dueño
router.post("/", async (req, res) => {
    try {
        const { nombre, dni, telefono, direccion, correo, contrasena } = req.body;

        if (!dni) {
            return res.status(400).json({ error: "El DNI es obligatorio." });
        }

        let contrasenaEncriptada = null;
        if (contrasena) {
            contrasenaEncriptada = await bcrypt.hash(contrasena, SALTRON_ROUNDS);
        }

        const [rows] = await db.query("SELECT * FROM duenos WHERE dni = ?", [dni]);

        if (rows.length > 0) {
            const duenoExistente = rows[0];
            
            await db.query(
                `UPDATE duenos 
                 SET correo = ?, 
                     contrasena = ?, 
                     telefono = COALESCE(?, telefono), 
                     direccion = COALESCE(?, direccion) 
                 WHERE dni = ?`,
                [correo || null, contrasenaEncriptada, telefono || null, direccion || null, dni]
            );

            if (correo) {
                const plantillaHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2c3e50; text-align: center;">¡Tu cuenta ha sido vinculada! 🏥</h2>
                        <p>Hola <strong>${duenoExistente.nombre}</strong>,</p>
                        <p>Te damos la bienvenida formal a la app móvil de <strong>Mascotas Portalino y Rondón</strong>.</p>
                        <p>Hemos vinculado con éxito tus datos veterinarios usando tu DNI (<strong>${dni}</strong>).</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">Veterinaria Mascotas Portalino y Rondón</p>
                    </div>
                `;
                enviarCorreoElectronico(correo, "¡Cuenta Vinculada con Éxito! - Veterinaria", plantillaHtml);
            }

            return res.json({ mensaje: "Cuenta vinculada con éxito. ¡Tus datos y mascotas están listos!" });

        } else {
            await db.query(
                `INSERT INTO duenos (nombre, dni, telefono, direccion, correo, contrasena) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, dni, telefono, direccion || null, correo || null, contrasenaEncriptada]
            );

            if (correo) {
                const plantillaHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #27ae60; text-align: center;">¡Bienvenido a la Veterinaria! 🐾</h2>
                        <p>Hola <strong>${nombre}</strong>,</p>
                        <p>Tu cuenta ha sido creada exitosamente en nuestro sistema.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="text-align: center; color: #7f8c8d;">Veterinaria Mascotas Portalino y Rondón</p>
                    </div>
                `;
                enviarCorreoElectronico(correo, "¡Bienvenido a Mascotas Portalino y Rondón!", plantillaHtml);
            }

            return res.json({ mensaje: "Dueño registrado" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar datos del perfil de un dueño por su ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, dni, telefono, direccion, correo, contrasena } = req.body;

        let queryContrasena = "";
        let parametros = [nombre, dni, telefono, direccion || null, correo || null];

        if (contrasena && contrasena.trim() !== "") {
            const contrasenaEncriptada = await bcrypt.hash(contrasena, SALTRON_ROUNDS);
            queryContrasena = `, contrasena = ?`;
            parametros.push(contrasenaEncriptada);
        }

        parametros.push(id);

        await db.query(
            `UPDATE duenos 
             SET nombre = ?, 
                 dni = ?, 
                 telefono = ?, 
                 direccion = ?, 
                 correo = ?
                 ${queryContrasena}
             WHERE id_dueno = ?`,
            parametros
        );

        const [rows] = await db.query(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo FROM duenos WHERE id_dueno = ?",
            [id]
        );

        res.json({ 
            mensaje: "Perfil actualizado con éxito",
            usuario: rows[0] 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Seguro
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const [rows] = await db.query(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo, contrasena FROM duenos WHERE correo = ?",
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "El correo electrónico o la contraseña son incorrectos." });
        }

        const usuario = rows[0];
        const contraseñaCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contraseñaCorrecta) {
            return res.status(401).json({ error: "El correo electrónico o la contraseña son incorrectos." });
        }

        delete usuario.contrasena;

        res.json({
            mensaje: "Login exitoso",
            usuario: usuario
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recuperar Contraseña
router.post("/recuperar-contrasena", async (req, res) => {
    try {
        const { correo } = req.body;
        const [rows] = await db.query("SELECT id_dueno, nombre FROM duenos WHERE correo = ?", [correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No encontramos ninguna cuenta asociada a este correo electrónico." });
        }

        const usuario = rows[0];
        const claveTemporal = Math.random().toString(36).substring(2, 10).toUpperCase();
        const hashTemporal = await bcrypt.hash(claveTemporal, SALTRON_ROUNDS);

        await db.query("UPDATE duenos SET contrasena = ? WHERE id_dueno = ?", [hashTemporal, usuario.id_dueno]);

        const plantillaHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e67e22; text-align: center;">Recuperación de Contraseña Real 🔑</h2>
                <p>Hola <strong>${usuario.nombre}</strong>,</p>
                <p>Hemos generado una contraseña de acceso temporal segura. Úsala para iniciar sesión y cámbiala de inmediato en tu perfil:</p>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 1.4rem; letter-spacing: 2px; border-radius: 5px; border: 1px dashed #e67e22; margin: 20px 0; font-family: monospace;">
                    <strong>${claveTemporal}</strong>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">Mascotas Portalino y Rondón</p>
            </div>
        `;

        await enviarCorreoElectronico(correo, "Restablecimiento de Credenciales - Veterinaria", plantillaHtml);
        res.json({ mensaje: "Se ha enviado un correo electrónico con tu nueva clave temporal de acceso." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar Dueño Seguro
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [citas] = await db.query(`
            SELECT COUNT(*) AS total 
            FROM citas c 
            INNER JOIN mascotas m ON c.id_mascota = m.id_mascota 
            WHERE m.id_dueno = ?`, 
            [id]
        );

        if (citas[0].total > 0) {
            return res.status(400).json({ 
                error: `No se puede eliminar al dueño. Sus mascotas tienen ${citas[0].total} cita(s) registrada(s) en el historial clínico.` 
            });
        }

        await db.query("DELETE FROM duenos WHERE id_dueno = ?", [id]);
        res.json({ mensaje: "Dueño y registros asociados eliminados con éxito." });

    } catch (error) {
        console.error("Error al intentar eliminar dueño:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar." });
    }
});

// Marcar mensajes como leídos (Afecta solo mensajes entrantes de CLIENTES)
router.post("/leer/:id_dueno", async (req, res) => {
    try {
        const { id_dueno } = req.params;

        await db.query(
            `UPDATE mensajes 
             SET leido = 1 
             WHERE id_dueno = ? AND remitente = 'CLIENTE' AND leido = 1`,
            [id_dueno]
        );

        if (req.app.get('io')) { 
            req.app.get('io').emit('actualizar_bandeja_admin');
        }

        res.json({ mensaje: "Mensajes marcados como leídos con éxito." });
    } catch (error) {
        console.error("❌ Error al marcar mensajes como leídos:", error);
        res.status(500).json({ error: error.message });
    }
});

// Bandeja de consultas optimizada con conteo real basado en mensajes no leídos
router.get("/bandeja", async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id_dueno,
                d.nombre AS nombre_cliente,
                (SELECT m.mensaje 
                 FROM mensajes m 
                 WHERE m.id_dueno = d.id_dueno 
                 ORDER BY m.fecha DESC LIMIT 1) AS ultimo_mensaje,
                (SELECT m.fecha 
                 FROM mensajes m 
                 WHERE m.id_dueno = d.id_dueno 
                 ORDER BY m.fecha DESC LIMIT 1) AS tiempo,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM mensajes m 
                    WHERE m.id_dueno = d.id_dueno 
                      AND m.remitente = 'CLIENTE' 
                      AND m.leido = 0
                ), 0) AS no_leidos
            FROM duenos d
            WHERE EXISTS (
                SELECT 1 FROM mensajes m WHERE m.id_dueno = d.id_dueno
            )
            ORDER BY tiempo DESC;
        `;

        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al cargar la bandeja de consultas:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;