import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: false,
})
export class GestionCitasPage implements OnInit {

  citas: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.api.obtenerCitas().subscribe({
      next: (data: any) => {
        this.citas = data;
        console.log('Citas cargadas:', this.citas);
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }
}