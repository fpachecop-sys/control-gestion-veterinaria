import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolActual: string = 'invitado';

  // Nuevas variables temporales para guardar los datos del registro
  private correoRegistrado: string = '';
  private contrasenaRegistrada: string = '';

  constructor() { }

  setRol(rol: string) {
    this.rolActual = rol;
  }

  getRol(): string {
    return this.rolActual;
  }

  // Guarda las credenciales recién creadas
  guardarCredencialesRegistro(correo: string, contrasena: string) {
    this.correoRegistrado = correo;
    this.contrasenaRegistrada = contrasena;
  }

  // Obtiene las credenciales y luego las limpia para que no se queden guardadas por siempre
  obtenerCredencialesRegistro() {
    const datos = {
      correo: this.correoRegistrado,
      contrasena: this.contrasenaRegistrada
    };
    // Limpiamos la memoria temporal
    this.correoRegistrado = '';
    this.contrasenaRegistrada = '';
    return datos;
  }
}