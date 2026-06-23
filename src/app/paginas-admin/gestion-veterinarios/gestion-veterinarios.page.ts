import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Ajusta la ruta relativa si es necesario

@Component({
  selector: 'app-gestion-veterinarios',
  templateUrl: './gestion-veterinarios.page.html',
  styleUrls: ['./gestion-veterinarios.page.scss'],
  standalone: false,
})
export class GestionVeterinariosPage implements OnInit {

  veterinarios: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  // 🚀 Se ejecuta cada vez que la pantalla se enfoca
  ionViewWillEnter() {
    this.cargarVeterinarios();
  }

  cargarVeterinarios() {
    this.api.obtenerVeterinarios().subscribe({
      next: (data: any) => {
        this.veterinarios = data;
        console.log('Veterinarios cargados desde la BD:', this.veterinarios);
      },
      error: (error) => {
        console.error('Error al traer veterinarios:', error);
      }
    });
  }
}