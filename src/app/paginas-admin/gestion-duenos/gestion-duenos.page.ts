import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; // 👈 Importamos el Router

@Component({
  selector: 'app-gestion-duenos',
  templateUrl: './gestion-duenos.page.html',
  styleUrls: ['./gestion-duenos.page.scss'],
  standalone: false,
})
export class GestionDuenosPage implements OnInit {

  duenos: any[] = [];

  constructor(private api: ApiService, private router: Router) { } // 👈 Inyectamos Router

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarDuenos();
  }

  cargarDuenos() {
    this.api.obtenerDuenos().subscribe({
      next: (data: any) => {
        this.duenos = data;
        console.log('Dueños traídos de la base de datos:', this.duenos);
      },
      error: (error) => {
        console.error('Error al cargar dueños:', error);
      }
    });
  }

  // 🚀 Envia los datos del dueño a la otra pantalla de forma inteligente
  editarDueno(dueno: any) {
    this.router.navigate(['/gestion-duenos/agregar-dueno'], { state: { dueno: dueno } });
  }

  // 🗑️ Elimina al dueño pidiendo una confirmación rápida
  eliminarDueno(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
      this.api.eliminarDueno(id).subscribe({
        next: (res: any) => {
          alert('Dueño eliminado con éxito.');
          this.cargarDuenos(); // Refresca la lista automáticamente
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('No se pudo eliminar al dueño.');
        }
      });
    }
  }
}