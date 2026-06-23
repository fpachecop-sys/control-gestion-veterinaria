import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-gestion-duenos',
  templateUrl: './gestion-duenos.page.html',
  styleUrls: ['./gestion-duenos.page.scss'],
  standalone: false,
})
export class GestionDuenosPage implements OnInit {

  duenos: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    // Se deja vacío por buenas prácticas o para cosas estáticas
  }

  // 🚀 Este evento se dispara SIEMPRE que regresas a esta pantalla, refrescando la lista de la BD
  ionViewWillEnter() {
    this.cargarDuenos();
  }

  cargarDuenos() {
    this.api.obtenerDuenos().subscribe({
      next: (data: any) => {
        this.duenos = data; // Aquí se guarda el arreglo de filas que retorna Express
        console.log('Dueños traídos de la base de datos:', this.duenos);
      },
      error: (error) => {
        console.error('Error al cargar dueños:', error);
      }
    });
  }
}