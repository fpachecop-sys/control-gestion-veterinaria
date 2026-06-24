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

  cita = {
    fecha: '',
    hora: '',
    id_mascota: '',
    id_veterinario: '',
    motivo: '',
    estado: 'PENDIENTE' // Guardamos el estado actual por si se edita
  };

  mascotas: any[] = [];
  veterinarios: any[] = [];
  esEdicion: boolean = false; // Flag detector
  idCitaEditar!: number;

  constructor(private router: Router, private api: ApiService) { 
    // 📦 Capturamos el objeto enviado por la lista
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion?.extras.state && navegacion.extras.state['cita']) {
      const citaCargada = navegacion.extras.state['cita'];
      
      // Formateamos la fecha a YYYY-MM-DD para que el input tipo date la pinte correctamente
      const fechaFormateada = citaCargada.fecha ? citaCargada.fecha.split('T')[0] : '';

      this.cita = {
        fecha: fechaFormateada,
        hora: citaCargada.hora,
        id_mascota: citaCargada.id_mascota,
        id_veterinario: citaCargada.id_veterinario,
        motivo: citaCargada.motivo,
        estado: citaCargada.estado
      };

      this.idCitaEditar = citaCargada.id_cita;
      this.esEdicion = true;
    }
  }

  ngOnInit() {
    this.cargarDatosSelects();
  }

  cargarDatosSelects() {
    this.api.obtenerMascotas().subscribe({
      next: (data: any) => this.mascotas = data,
      error: (err) => console.error(err)
    });

    this.api.obtenerVeterinarios().subscribe({
      next: (data: any) => this.veterinarios = data,
      error: (err) => console.error(err)
    });
  }

  guardarCita() {
    if (!this.cita.fecha || !this.cita.hora || !this.cita.id_mascota || !this.cita.id_veterinario || !this.cita.motivo) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (this.esEdicion) {
      // 🔄 MODO EDICIÓN: Invoca el PUT modificado
      this.api.actualizarCita(this.idCitaEditar, this.cita).subscribe({
        next: (response: any) => {
          alert('¡Cita modificada con éxito!');
          this.router.navigate(['/gestion-citas']);
        },
        error: (error) => {
          console.error('Error al editar cita:', error);
          alert('Error al actualizar en el servidor.');
        }
      });
    } else {
      // 🚀 MODO REGISTRO: Invoca el POST original
      this.api.registrarCita(this.cita).subscribe({
        next: (response: any) => {
          alert('¡Cita registrada y agendada con éxito!');
          this.router.navigate(['/gestion-citas']);
        },
        error: (error) => {
          console.error('Error al agendar cita:', error);
          alert('Hubo un error al registrar en el servidor.');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/gestion-citas']);
  }
}