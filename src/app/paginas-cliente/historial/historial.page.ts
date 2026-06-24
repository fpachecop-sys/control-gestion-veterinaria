import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Ajusta la ruta a tu api.service si es necesario

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage {

  listaCitas: any[] = [];
  cargando: boolean = true;

  constructor(private api: ApiService) { }

  ionViewWillEnter() {
    this.obtenerMisCitas();
  }

  obtenerMisCitas() {
    const usuarioLogueado = localStorage.getItem('usuario');

    if (usuarioLogueado) {
      const usuario = JSON.parse(usuarioLogueado);
      const idDueno = usuario.id_dueno;

      this.api.obtenerCitasPorDueno(idDueno).subscribe({
        next: (data: any) => {
          this.listaCitas = data;
          this.cargando = false;
          console.log('Mis citas reales cargadas:', this.listaCitas);
        },
        error: (err) => {
          console.error('Error al obtener citas del cliente:', err);
          this.cargando = false;
        }
      });
    } else {
      this.cargando = false;
    }
  }

  // Helper opcional por si necesitas formatear la fecha que viene de MySQL (YYYY-MM-DD a DD/MM/YYYY)
  formatearFecha(fechaString: string): string {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return fechaString; // Si ya viene formateada, la devuelve igual
    return fecha.toLocaleDateString('es-PE', { timeZone: 'UTC' });
  }
}