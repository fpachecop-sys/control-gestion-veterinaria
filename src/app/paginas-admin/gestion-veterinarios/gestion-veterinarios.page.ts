import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; 
import { Router } from '@angular/router'; // 👈 Importamos el Router

@Component({
  selector: 'app-gestion-veterinarios',
  templateUrl: './gestion-veterinarios.page.html',
  styleUrls: ['./gestion-veterinarios.page.scss'],
  standalone: false,
})
export class GestionVeterinariosPage implements OnInit {

  veterinarios: any[] = [];

  constructor(private api: ApiService, private router: Router) { } // 👈 Inyectamos el Router

  ngOnInit() {
  }

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

  // 🚀 Navega al formulario llevando los datos del veterinario seleccionado
  editarVeterinario(veterinario: any) {
    this.router.navigate(['/gestion-veterinarios/agregar-veterinario'], { state: { veterinario: veterinario } });
  }

  // 🗑️ Elimina solicitando una confirmación en pantalla
  eliminarVeterinario(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar al ${nombre}?`)) {
      this.api.eliminarVeterinario(id).subscribe({
        next: (res: any) => {
          alert('Veterinario eliminado con éxito.');
          this.cargarVeterinarios(); // Recargamos el listado al instante
        },
        error: (error) => {
          console.error('Error al eliminar veterinario:', error);
          alert('No se pudo eliminar al veterinario debido a un error del servidor.');
        }
      });
    }
  }
}