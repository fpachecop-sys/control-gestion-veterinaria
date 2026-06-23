import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; // 🚀 Ajusta la ruta correcta a tu ApiService
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestion-estadisticas',
  templateUrl: './gestion-estadisticas.page.html',
  styleUrls: ['./gestion-estadisticas.page.scss'],
  standalone: false,
})
export class GestionEstadisticasPage implements OnInit {

  // Estructura reactiva real conectada al HTML
  estadisticas: any = {
    total_mascotas: 0,
    total_duenos: 0,
    total_veterinarios: 0,
    total_citas: 0,
    citas_pendientes: 0,
    citas_atendidas: 0,
    citas_canceladas: 0
  };

  // Arreglos dinámicos para los bucles *ngFor
  conteoEspecies: any[] = [];
  veterinariosPopulares: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  // 🚀 Carga datos frescos cada vez que el administrador abre la vista
  ionViewWillEnter() {
    this.cargarEstadisticasReales();
  }

  cargarEstadisticasReales() {
    forkJoin({
      mascotas: this.api.obtenerMascotas(),
      duenos: this.api.obtenerDuenos(),
      veterinarios: this.api.obtenerVeterinarios(),
      citas: this.api.obtenerCitas()
    }).subscribe({
      next: (res: any) => {
        const listaMascotas = res.mascotas || [];
        const listaDuenos = res.duenos || [];
        const listaVeterinarios = res.veterinarios || [];
        const listaCitas = res.citas || [];

        // 1. Asignar Contadores Globales
        this.estadisticas.total_mascotas = listaMascotas.length;
        this.estadisticas.total_duenos = listaDuenos.length;
        this.estadisticas.total_veterinarios = listaVeterinarios.length;
        this.estadisticas.total_citas = listaCitas.length;

        // 2. Filtrar Citas según su Estado
        this.estadisticas.citas_pendientes = listaCitas.filter((c: any) => c.estado?.toUpperCase() === 'PENDIENTE').length;
        this.estadisticas.citas_atendidas = listaCitas.filter((c: any) => c.estado?.toUpperCase() === 'ATENDIDA').length;
        this.estadisticas.citas_canceladas = listaCitas.filter((c: any) => c.estado?.toUpperCase() === 'CANCELADA').length;

        // 3. Mapeo Dinámico de Mascotas por Especie (Reduce automatizado)
        const mapaEspecies = listaMascotas.reduce((acc: any, m: any) => {
          // Normalizamos la cadena (ej: "Perro", "perro" -> "PERRO")
          const esp = m.especie ? m.especie.trim().toUpperCase() : 'OTRO';
          acc[esp] = (acc[esp] || 0) + 1;
          return acc;
        }, {});

        // Convertimos el mapa en un array legible para el HTML asignándole un emoji representativo
        this.conteoEspecies = Object.keys(mapaEspecies).map(key => {
          let emoji = '🐾';
          if (key.includes('PERRO') || key.includes('CAN')) emoji = '🐶';
          if (key.includes('GATO') || key.includes('FEL')) emoji = '🐱';
          if (key.includes('AVE') || key.includes('PAJ') || key.includes('LOR')) emoji = '🦜';
          
          // Formateamos la primera letra en mayúscula (ej: Perros)
          const nombreFormateado = key.charAt(0) + key.slice(1).toLowerCase() + 's';
          return { nombre: `${emoji} ${nombreFormateado}`, cantidad: mapaEspecies[key] };
        });

        // 4. Mapeo de Veterinarios Más Solicitados
        const mapaVeterinarios = listaCitas.reduce((acc: any, c: any) => {
          const vetNombre = c.veterinario || 'No asignado';
          acc[vetNombre] = (acc[vetNombre] || 0) + 1;
          return acc;
        }, {});

        // Cruzamos la cantidad de citas con los datos de especialidad del veterinario
        this.veterinariosPopulares = listaVeterinarios.map((v: any) => {
          return {
            nombre: v.nombre,
            especialidad: v.especialidad || 'General',
            citas: mapaVeterinarios[v.nombre] || 0
          };
        })
        // Ordenamos de mayor a menor cantidad de citas atendidas
        .sort((a: any, b: any) => b.citas - a.citas)
        // Tomamos únicamente el Top 3
        .slice(0, 3);
      },
      error: (err) => {
        console.error('Error procesando las estadísticas del servidor:', err);
      }
    });
  }
}