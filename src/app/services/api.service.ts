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
}