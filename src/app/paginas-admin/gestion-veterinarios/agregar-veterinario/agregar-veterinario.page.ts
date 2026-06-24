import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service'; 

@Component({
  selector: 'app-agregar-veterinario',
  templateUrl: './agregar-veterinario.page.html',
  styleUrls: ['./agregar-veterinario.page.scss'],
  standalone: false
})
export class AgregarVeterinarioPage implements OnInit {

  veterinario = {
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: ''
  };

  esEdicion: boolean = false; // Flag detector de estado
  idVeterinarioEditar!: number;

  constructor(private router: Router, private api: ApiService) { 
    // 📦 Capturamos el objeto enviado por state desde la vista de gestión
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion?.extras.state && navegacion.extras.state['veterinario']) {
      const vCargado = navegacion.extras.state['veterinario'];
      
      this.veterinario = {
        nombre: vCargado.nombre,
        especialidad: vCargado.especialidad,
        correo: vCargado.correo,
        telefono: vCargado.telefono
      };

      this.idVeterinarioEditar = vCargado.id_veterinario;
      this.esEdicion = true; // Cambiamos a modo edición
    }
  }

  ngOnInit() {
  }

  guardarVeterinario() {
    if (!this.veterinario.nombre || !this.veterinario.especialidad || !this.veterinario.correo) {
      alert('Por favor, complete los campos requeridos.');
      return;
    }

    if (this.esEdicion) {
      // 🔄 MODO EDICIÓN: Consumimos el método PUT
      console.log('Actualizando veterinario:', this.veterinario);
      this.api.actualizarVeterinario(this.idVeterinarioEditar, this.veterinario).subscribe({
        next: (response: any) => {
          alert('¡Veterinario actualizado con éxito!');
          this.router.navigate(['/gestion-veterinarios']);
        },
        error: (error) => {
          console.error('Error al actualizar veterinario:', error);
          alert('Hubo un error al actualizar los datos.');
        }
      });

    } else {
      // 🚀 MODO REGISTRO: Consumimos el método POST original
      console.log('Enviando veterinario a producción local:', this.veterinario);
      this.api.registrarVeterinario(this.veterinario).subscribe({
        next: (response: any) => {
          console.log('Respuesta backend:', response);
          alert('¡Veterinario registrado con éxito!');
          this.router.navigate(['/gestion-veterinarios']);
        },
        error: (error) => {
          console.error('Error al guardar veterinario:', error);
          alert('Ocurrió un inconveniente al conectar con el servidor.');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/gestion-veterinarios']);
  }
}