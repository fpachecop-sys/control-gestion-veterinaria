import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-estadisticas',
  templateUrl: './gestion-estadisticas.page.html',
  styleUrls: ['./gestion-estadisticas.page.scss'],
  standalone: false,
})
export class GestionEstadisticasPage implements OnInit {

  // 1. DEFINIR LA VARIABLE AQUÍ PARA QUE EL HTML LA RECONOZCA
  estadisticas: any = {
    total_mascotas: 0,
    total_duenos: 0,
    total_veterinarios: 0,
    total_citas: 0,
    citas_pendientes: 0,
    citas_atendidas: 0,
    citas_canceladas: 0
  };

  constructor() { }

  ngOnInit() {
    // Aquí es donde normalmente llamarías a tu servicio para cargar los datos reales de la BD
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // Simulamos la carga de datos con valores de ejemplo
    this.estadisticas = {
      total_mascotas: 30,
      total_duenos: 24,
      total_veterinarios: 10,
      total_citas: 60,
      citas_pendientes: 10,
      citas_atendidas: 45,
      citas_canceladas: 5
    };
  }

}