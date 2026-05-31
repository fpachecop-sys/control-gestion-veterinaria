import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Almacenamiento temporal para el registro de credenciales
  private correoRegistrado: string = '';
  private contrasenaRegistrada: string = '';

  constructor() { }

  /**
   * Guarda el rol de forma persistente en el almacenamiento local
   */
  setRol(rol: string) {
    localStorage.setItem('rolUsuario', rol);
  }

  /**
   * Obtiene el rol persistente. Si no hay ninguno iniciado, devuelve 'ninguno'
   */
  getRol(): string {
    return localStorage.getItem('rolUsuario') || 'ninguno';
  }

  /**
   * Limpia el rol guardado al momento de dar click en cerrar sesión
   */
  clearSession() {
    localStorage.removeItem('rolUsuario');
  }

  // Guarda las credenciales recién creadas
  guardarCredencialesRegistro(correo: string, contrasena: string) {
    this.correoRegistrado = correo;
    this.contrasenaRegistrada = contrasena;
  }

  // Obtiene las credenciales y luego las limpia de la memoria temporal
  obtenerCredencialesRegistro() {
    const datos = {
      correo: this.correoRegistrado,
      contrasena: this.contrasenaRegistrada
    };
    this.correoRegistrado = '';
    this.contrasenaRegistrada = '';
    return datos;
  }
}