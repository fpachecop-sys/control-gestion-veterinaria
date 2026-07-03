import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-gestion-duenos',
  templateUrl: './gestion-duenos.page.html',
  styleUrls: ['./gestion-duenos.page.scss'],
  standalone: false,
})
export class GestionDuenosPage implements OnInit {

  duenos: any[] = [];

  constructor(private api: ApiService, private router: Router) { } 

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

  // 🚀 Envía los datos del dueño a la otra pantalla de forma inteligente
  editarDueno(dueno: any) {
    this.router.navigate(['/gestion-duenos/agregar-dueno'], { state: { dueno: dueno } });
  }

  confirmarEliminar(id: number, nombre: string) {
    const seguro = confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`);
    if (seguro) {
      this.eliminarCliente(id);
    }
  }

  eliminarCliente(id: number) {
    this.api.eliminarDueno(id).subscribe({
      next: (res: any) => {
        alert('¡Dueño eliminado con éxito!');
        this.cargarDuenos(); 
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          alert(err.error.error); 
        } else {
          alert('Ocurrió un error inesperado al intentar eliminar.');
        }
      }
    });
  }
}