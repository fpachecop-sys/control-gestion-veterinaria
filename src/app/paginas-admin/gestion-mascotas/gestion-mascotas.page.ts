import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; // 👈 Importamos el Router

@Component({
  selector: 'app-gestion-mascotas',
  templateUrl: './gestion-mascotas.page.html',
  styleUrls: ['./gestion-mascotas.page.scss'],
  standalone: false,
})
export class GestionMascotasPage implements OnInit {

  mascotas: any[] = [];

  constructor(private api: ApiService, private router: Router) { } // 👈 Inyectamos Router

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

  // 🚀 Navega al formulario pasando la mascota elegida
  editarMascota(mascota: any) {
    // Tomamos en cuenta la estructura de carpetas de tu proyecto (/gestion-mascotas/agregar-mascotas)
    this.router.navigate(['/gestion-mascotas/agregar-mascotas'], { state: { mascota: mascota } });
  }

  // 🗑️ Elimina a la mascota pidiendo confirmación previa
  eliminarMascota(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
      this.api.eliminarMascota(id).subscribe({
        next: (res: any) => {
          alert('Mascota eliminada con éxito.');
          this.cargarMascotas(); // Recarga la lista en tiempo real
        },
        error: (error) => {
          console.error('Error al eliminar mascota:', error);
          alert('Hubo un error al intentar eliminar la mascota.');
        }
      });
    }
  }
}