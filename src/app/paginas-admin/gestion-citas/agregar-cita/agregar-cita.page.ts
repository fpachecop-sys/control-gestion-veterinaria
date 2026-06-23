import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-agregar-cita',
  templateUrl: './agregar-cita.page.html',
  styleUrls: ['./agregar-cita.page.scss'],
  standalone: false
})
export class AgregarCitaPage implements OnInit {

  // Adaptamos las variables idénticas a los parámetros estructurados en la query del backend
  cita = {
    fecha: '',
    hora: '',
    id_mascota: '',
    id_veterinario: '',
    motivo: ''
  };

  mascotas: any[] = [];
  veterinarios: any[] = [];

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.cargarDatosSelects();
  }

  cargarDatosSelects() {
    // 1. Obtener Mascotas reales de la BD
    this.api.obtenerMascotas().subscribe({
      next: (data: any) => this.mascotas = data,
      error: (err) => console.error('Error cargando mascotas:', err)
    });

    // 2. Obtener Veterinarios reales de la BD
    this.api.obtenerVeterinarios().subscribe({
      next: (data: any) => this.veterinarios = data,
      error: (err) => console.error('Error cargando veterinarios:', err)
    });
  }

  guardarCita() {
    if (!this.cita.fecha || !this.cita.hora || !this.cita.id_mascota || !this.cita.id_veterinario || !this.cita.motivo) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    console.log('Enviando cita al backend:', this.cita);

    this.api.registrarCita(this.cita).subscribe({
      next: (response: any) => {
        console.log(response);
        alert('¡Cita registrada y agendada con éxito!');
        this.router.navigate(['/gestion-citas']); // Usa la ruta base para asegurar el retorno
      },
      error: (error) => {
        console.error('Error al agendar cita:', error);
        alert('Hubo un error al registrar en el servidor.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/gestion-citas']);
  }
}