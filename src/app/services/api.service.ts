import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL del backend
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Dueños
  obtenerDuenos() {
    return this.http.get(`${this.apiUrl}/duenos`);
  }

  registrarDueno(data: any) {
    return this.http.post(`${this.apiUrl}/duenos`, data);
  }
  obtenerMascotas() {
    return this.http.get(`${this.apiUrl}/mascotas`);
  }

  registrarMascota(data: any) {
    return this.http.post(`${this.apiUrl}/mascotas`, data);
  }
  obtenerVeterinarios() {
  return this.http.get(`${this.apiUrl}/veterinarios`);
  }

  registrarVeterinario(data: any) {
  return this.http.post(`${this.apiUrl}/veterinarios`, data);
  }
  obtenerCitas() {
  return this.http.get(`${this.apiUrl}/citas`);
  }

  registrarCita(data: any) {
  return this.http.post(`${this.apiUrl}/citas`, data);
  }
  
registrarUsuario(datos: any) {
  return this.http.post(`${this.apiUrl}/duenos`, datos);
}

loginUsuario(correo: string, contrasena: string) {
  return this.http.post(`${this.apiUrl}/duenos/login`, { correo, contrasena });
}
obtenerMascotasPorDueno(idDueno: number) {
  return this.http.get(`${this.apiUrl}/mascotas/dueno/${idDueno}`); 
  
}
obtenerCitasPorDueno(idDueno: number) {
  return this.http.get(`${this.apiUrl}/citas/dueno/${idDueno}`);
}


actualizarDueno(id: number, datos: any) {
  return this.http.put(`${this.apiUrl}/duenos/${id}`, datos); 
}

eliminarDueno(id: number) {
  return this.http.delete(`${this.apiUrl}/duenos/${id}`);
}


actualizarMascota(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/mascotas/${id}`, data);
}

eliminarMascota(id: number) {
  return this.http.delete(`${this.apiUrl}/mascotas/${id}`);
}

actualizarVeterinario(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/veterinarios/${id}`, data);
}

eliminarVeterinario(id: number) {
  return this.http.delete(`${this.apiUrl}/veterinarios/${id}`);
}

actualizarEstadoCita(id: number, estado: string) {
  return this.http.put(`${this.apiUrl}/citas/${id}`, { estado });
}

actualizarCita(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/citas/${id}`, data);
}

eliminarCita(id: number) {
  return this.http.delete(`${this.apiUrl}/citas/${id}`);
}
}