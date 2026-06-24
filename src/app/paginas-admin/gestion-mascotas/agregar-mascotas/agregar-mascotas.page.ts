import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-agregar-mascotas',
  templateUrl: './agregar-mascotas.page.html',
  styleUrls: ['./agregar-mascotas.page.scss'],
  standalone: false
})
export class AgregarMascotasPage implements OnInit {

  mascota = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    id_dueno: ''
  };

  duenos: any[] = []; 
  esEdicion: boolean = false; // Flag para saber si guarda o actualiza
  idMascotaEditar!: number;

  constructor(private router: Router, private api: ApiService) {
    // 📦 Capturamos el objeto enviado desde la lista de gestión
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion?.extras.state && navegacion.extras.state['mascota']) {
      const mascotaCargada = navegacion.extras.state['mascota'];
      
      this.mascota = {
        nombre: mascotaCargada.nombre,
        especie: mascotaCargada.especie,
        raza: mascotaCargada.raza,
        edad: mascotaCargada.edad,
        id_dueno: mascotaCargada.id_dueno
      };

      this.idMascotaEditar = mascotaCargada.id_mascota;
      this.esEdicion = true; // Activamos modo edición
    }
  }

  ngOnInit() {
    this.cargarDuenosParaSelect();
  }

  cargarDuenosParaSelect() {
    this.api.obtenerDuenos().subscribe({
      next: (data: any) => {
        this.duenos = data;
      },
      error: (err) => console.error('Error al obtener dueños para el formulario:', err)
    });
  }

  guardarMascota() {
    if (!this.mascota.nombre || !this.mascota.especie || !this.mascota.id_dueno) {
      alert('Por favor, complete los campos obligatorios.');
      return;
    }

    if (this.esEdicion) {
      // 🔄 MODO EDICIÓN: Invoca el endpoint PUT
      console.log('Actualizando datos de la mascota:', this.mascota);
      this.api.actualizarMascota(this.idMascotaEditar, this.mascota).subscribe({
        next: (response: any) => {
          alert('¡Mascota actualizada con éxito!');
          this.router.navigate(['/gestion-mascotas']);
        },
        error: (error) => {
          console.error('Error al actualizar mascota:', error);
          alert('Error al actualizar en el servidor.');
        }
      });

    } else {
      // 🚀 MODO REGISTRO: Invoca el endpoint POST original
      console.log('Insertando mascota en el backend:', this.mascota);
      this.api.registrarMascota(this.mascota).subscribe({
        next: (response: any) => {
          console.log(response);
          alert('¡Mascota registrada con éxito!');
          this.router.navigate(['/gestion-mascotas']);
        },
        error: (error) => {
          console.error('Error al registrar mascota:', error);
          alert('Hubo un error al guardar en el servidor.');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/gestion-mascotas']);
  }
}