# Sistema de Veterinaria - Control de Accesos y Registro Condicional
Este repositorio contiene el avance del frontend (Ionic/Angular) y backend (Node.js/Express) correspondientes al módulo de autenticación, gestión de dueños y vinculación inteligente de cuentas de clientes.
---
## Estado Actual del Avance
Se agregaron registros para dueños, citas, mascotas, veterinarios en la vista de administrador

Se mejoró el registro, login de cada usuario, se pueden vincular usuarios existentes registrados por un administrador usando el DNI como ID de conexion.


USUARIOS:

**estos son los unicos usuarios que por momento se usan para pruebas rapidas (correo user ejemplo funcional)**


ADMIN.- admin@correo.com contra: admin123

----

USER.- francomarianopp@gmail.com contra: franco123
---

##  Lógica de Vinculación Inteligente (DNI)

Para optimizar la experiencia de usuario y evitar duplicados en la base de datos, se diseñó un flujo condicional en el backend (`POST /duenos`):

1.  **Registro en Clínica (Admin):** El administrador registra al dueño únicamente con sus datos esenciales (DNI, Nombre, Teléfono, Dirección). El backend detecta que el DNI no existe y realiza un `INSERT` (dejando los campos de `correo` y `contrasena` listos en `NULL`).
2.  **Vinculación desde Casa (Cliente):** Cuando el cliente ingresa a la aplicación por primera vez desde su hogar para revisar sus mascotas, introduce su **DNI**, su nuevo correo y contraseña. El backend detecta que el DNI **ya existe**, y en lugar de rebotar la petición o duplicar la fila, ejecuta un `UPDATE` inyectando las credenciales de acceso al registro que creó el administrador.
---
## Nota de Despliegue / Base de Datos
 [!IMPORTANTE]
AVANCE MAS DEL 70% DEL PROYECTO

RESTANTE:

IMPLEMENTACION DE CHAT EN TIEMPO REAL ENTRE USUARIOS Y ADMINISTRADORES.
