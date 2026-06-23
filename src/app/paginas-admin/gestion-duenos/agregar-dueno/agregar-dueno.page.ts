import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service'; // Asegúrate de que la ruta a tu servicio sea correcta

@Component({
  selector: 'app-agregar-dueno',
  templateUrl: './agregar-dueno.page.html',
  styleUrls: ['./agregar-dueno.page.scss'],
  standalone: false
})
export class AgregarDuenoPage implements OnInit {

  dueno = {
    dni: '',
    nombre: '',
    telefono: '',
    direccion: ''
  };

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
  }

  guardarDueno() {
    // Validación básica antes de mandar al backend
    if (!this.dueno.dni || !this.dueno.nombre || !this.dueno.telefono || !this.dueno.direccion) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }

    console.log('Enviando dueño al backend real:', this.dueno);

    // 🚀 Llamamos a la función real de tu compañero enviando los datos del formulario
    this.api.registrarDueno(this.dueno).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        alert('¡Dueño registrado con éxito en la Base de Datos!');
        
        // Regresamos al panel principal de gestión de dueños
        this.router.navigate(['/gestion-duenos']);
      },
      error: (error) => {
        console.error('Error al registrar dueño:', error);
        alert('Hubo un error al guardar en el servidor: ' + (error.error?.error || error.message));
      }
    });
  }

  cancelar() {
    this.router.navigate(['/gestion-duenos']);
  }

}