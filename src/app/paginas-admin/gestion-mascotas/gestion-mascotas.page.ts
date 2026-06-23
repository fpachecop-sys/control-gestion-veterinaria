import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-gestion-mascotas',
  templateUrl: './gestion-mascotas.page.html',
  styleUrls: ['./gestion-mascotas.page.scss'],
  standalone: false,
})
export class GestionMascotasPage implements OnInit {

  mascotas: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.api.obtenerMascotas().subscribe({
      next: (data: any) => {
        this.mascotas = data;
        console.log('Mascotas desde la BD:', this.mascotas);
      },
      error: (error) => {
        console.error('Error al cargar mascotas:', error);
      }
    });
  }
}