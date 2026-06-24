import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Asegúrate de que la ruta sea la correcta

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  standalone: false, 
})
export class MascotasPage {

  listaMascotas: any[] = [];
  cargando: boolean = true;

  constructor(private api: ApiService) { }

  ionViewWillEnter() {
    this.obtenerMisMascotas();
  }

  obtenerMisMascotas() {
    const usuarioLogueado = localStorage.getItem('usuario');
    
    if (usuarioLogueado) {
      const usuario = JSON.parse(usuarioLogueado);
      const idDueno = usuario.id_dueno; // 🚀 El id_dueno real que recuperamos gracias al login corregido

      this.api.obtenerMascotasPorDueno(idDueno).subscribe({
        next: (data: any) => {
          this.listaMascotas = data;
          this.cargando = false;
          console.log('Mis mascotas cargadas con éxito:', this.listaMascotas);
        },
        error: (err) => {
          console.error('Error al obtener mascotas del cliente:', err);
          this.cargando = false;
        }
      });
    } else {
      this.cargando = false;
    }
  }
}