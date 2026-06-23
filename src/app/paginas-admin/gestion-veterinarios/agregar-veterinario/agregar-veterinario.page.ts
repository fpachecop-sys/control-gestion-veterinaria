import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service'; // 🚀 Importamos el servicio

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

  // Inyectamos el ApiService
  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
  }

  guardarVeterinario() {
    // Validación básica de inputs obligatorios
    if (!this.veterinario.nombre || !this.veterinario.especialidad || !this.veterinario.correo) {
      alert('Por favor, complete los campos requeridos.');
      return;
    }

    console.log('Enviando veterinario a producción local:', this.veterinario);

    // 🚀 Consumimos el método HTTP Post
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

  cancelar() {
    this.router.navigate(['/gestion-veterinarios']);
  }
}