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

  // Cambiado duenoId a id_dueno para coincidir exactamente con el backend de tu compañero
  mascota = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    id_dueno: ''
  };

  duenos: any[] = []; // Almacenará la lista de dueños reales para el select

  constructor(private router: Router, private api: ApiService) { }

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

  cancelar() {
    this.router.navigate(['/gestion-mascotas']);
  }
}