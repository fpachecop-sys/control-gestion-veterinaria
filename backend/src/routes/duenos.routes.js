const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs"); // 👈 Inyección de seguridad para encriptar

const SALTRON_ROUNDS = 10; // Nivel de seguridad para la encriptación

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

// Registrar o Vincular dueño (Con contraseñas encriptadas y correos reales)
router.post("/", async (req, res) => {
    try {
        const { nombre, dni, telefono, direccion, correo, contrasena } = req.body;

        if (!dni) {
            return res.status(400).json({ error: "El DNI es obligatorio." });
        }

        // Encriptamos la contraseña elegida por el usuario para la app si viene en la petición
        let contrasenaEncriptada = null;
        if (contrasena) {
            contrasenaEncriptada = await bcrypt.hash(contrasena, SALTRON_ROUNDS);
        }

        const [rows] = await db.query("SELECT * FROM duenos WHERE dni = ?", [dni]);

        if (rows.length > 0) {
            const duenoExistente = rows[0];
            
            // 🚀 CASO A: Vinculación inteligente (El admin ya lo creó previamente en la veterinaria)
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
                        <p>Hemos vinculado con éxito tus datos veterinarios usando tu DNI (<strong>${dni}</strong>). Ya puedes acceder para revisar las próximas citas y el historial clínico de tus mascotas de forma segura.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 0.8rem; color: #7f8c8d; text-align: center;">Veterinaria Mascotas Portalino y Rondón</p>
                    </div>
                `;
                enviarCorreoElectronico(correo, "¡Cuenta Vinculada con Éxito! - Veterinaria", plantillaHtml);
            }

            return res.json({ mensaje: "Cuenta vinculada con éxito. ¡Tus datos y mascotas están listos!" });

        } else {
            // 📝 CASO B: Registro desde cero
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
                        <p>Estamos muy felices de acompañarte en el cuidado de tus mejores amigos de cuatro patas.</p>
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
// Actualizar datos del perfil de un dueño por su ID (Incluye Correo y Contraseña segura)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, dni, telefono, direccion, correo, contrasena } = req.body;

        // 1. Verificamos si el usuario ingresó una nueva contraseña desde su perfil
        let queryContrasena = "";
        let parametros = [nombre, dni, telefono, direccion || null, correo || null];

        if (contrasena && contrasena.trim() !== "") {
            // Si escribió algo, encriptamos la nueva clave usando bcryptjs
            const contrasenaEncriptada = await bcrypt.hash(contrasena, SALTRON_ROUNDS);
            queryContrasena = `, contrasena = ?`;
            parametros.push(contrasenaEncriptada);
        }

        // Añadimos el ID al final de los parámetros para el WHERE
        parametros.push(id);

        // 2. Ejecutamos la actualización completa en MySQL
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

        // 3. Volvemos a consultar los datos actualizados del usuario (sin mandar el hash) para devolvérselos al frontend
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

// Endpoint para el Inicio de Sesión de Clientes (Login Seguro)
// Endpoint para el Inicio de Sesión de Clientes (Login Seguro)
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Buscamos al dueño por correo electrónico (AQUÍ agregamos 'correo' 🚀)
        const [rows] = await db.query(
            "SELECT id_dueno, nombre, dni, telefono, direccion, correo, contrasena FROM duenos WHERE correo = ?",
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "El correo electrónico o la contraseña son incorrectos." });
        }

        const usuario = rows[0];

        // Comparamos la contraseña ingresada con el hash guardado en MySQL de forma segura
        const contraseñaCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contraseñaCorrecta) {
            return res.status(401).json({ error: "El correo electrónico o la contraseña son incorrectos." });
        }

        // Eliminamos la contraseña del objeto antes de enviarlo al frontend por seguridad
        delete usuario.contrasena;

        res.json({
            mensaje: "Login exitoso",
            usuario: usuario
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para el restablecimiento de credenciales por correo electrónico
router.post("/recuperar-contrasena", async (req, res) => {
    try {
        const { correo } = req.body;

        const [rows] = await db.query("SELECT id_dueno, nombre FROM duenos WHERE correo = ?", [correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No encontramos ninguna cuenta asociada a este correo electrónico." });
        }

        const usuario = rows[0];

        // 💡 Explicación de seguridad para producción:
        // Como las contraseñas ahora están encriptadas con un hash que no se puede revertir, 
        // lo correcto para un sistema real es generar una contraseña provisoria aleatoria, 
        // actualizarla en la base de datos y enviarle esa clave temporal al cliente para que acceda.

        const claveTemporal = Math.random().toString(36).substring(2, 10).toUpperCase(); // Genera una clave aleatoria de 8 caracteres
        const hashTemporal = await bcrypt.hash(claveTemporal, SALTRON_ROUNDS);

        await db.query("UPDATE duenos SET contrasena = ? WHERE id_dueno = ?", [hashTemporal, usuario.id_dueno]);

        const plantillaHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e67e22; text-align: center;">Recuperación de Contraseña Real 🔑</h2>
                <p>Hola <strong>${usuario.nombre}</strong>,</p>
                <p>Recibimos una solicitud para restablecer tu acceso a la app móvil de la veterinaria.</p>
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

module.exports = router;