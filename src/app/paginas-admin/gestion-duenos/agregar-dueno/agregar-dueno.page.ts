import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

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

  esEdicion: boolean = false; // Nos ayuda a saber si estamos editando o creando
  idDuenoEditar!: number;

  constructor(private router: Router, private api: ApiService) {
    // 📦 Capturamos el objeto enviado por la pantalla anterior
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion?.extras.state && navegacion.extras.state['dueno']) {
      const duenoCargado = navegacion.extras.state['dueno'];
      
      // Mapeamos los datos al formulario
      this.dueno = {
        dni: duenoCargado.dni,
        nombre: duenoCargado.nombre,
        telefono: duenoCargado.telefono,
        direccion: duenoCargado.direccion
      };
      
      this.idDuenoEditar = duenoCargado.id_dueno;
      this.esEdicion = true; // Cambiamos el modo a Edición
    }
  }

  ngOnInit() {}

  guardarDueno() {
    if (!this.dueno.dni || !this.dueno.nombre || !this.dueno.telefono || !this.dueno.direccion) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }

    if (this.esEdicion) {
      // 🔄 MODO EDICIÓN: Llamar a actualizar
      console.log('Actualizando dueño:', this.dueno);
      this.api.actualizarDueno(this.idDuenoEditar, this.dueno).subscribe({
        next: (response: any) => {
          alert('¡Dueño actualizado con éxito!');
          this.router.navigate(['/gestion-duenos']);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar: ' + (error.error?.error || error.message));
        }
      });

    } else {
      // 🚀 MODO REGISTRO: Crear uno nuevo (Tu código original)
      console.log('Enviando nuevo dueño:', this.dueno);
      this.api.registrarDueno(this.dueno).subscribe({
        next: (response: any) => {
          alert('¡Dueño registrado con éxito en la Base de Datos!');
          this.router.navigate(['/gestion-duenos']);
        },
        error: (error) => {
          console.error('Error al registrar dueño:', error);
          alert('Hubo un error al guardar: ' + (error.error?.error || error.message));
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/gestion-duenos']);
  }
}