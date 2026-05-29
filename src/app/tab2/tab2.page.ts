import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; // 1. Importamos el servicio

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  nombreCompleto : string='';
  dni : string='';
  telefono: string='';
  correo: string='';
  contrasena: string='';
  confirmarContrasena: string='';
  aceptaTerminos: boolean = false;

  // 2. Inyectamos el AuthService en el constructor
  constructor(private router: Router, private authService: AuthService) {}

  registrarCuenta(){
    if (this.nombreCompleto === '' || this.dni === '' || this.telefono === '' || 
        this.correo === '' || this.contrasena === '' || this.confirmarContrasena === '') {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    if(this.contrasena !== this.confirmarContrasena){
      alert('Las contraseñas no coinciden');
      return;
    } 

    if(this.aceptaTerminos == false){
      alert('Debes aceptar los Términos y Condiciones para completar el registro');
      return;
    }

    alert('Cuenta registrada con éxito');

    // 3. Enviamos el correo y contraseña al servicio antes de borrar las variables
    this.authService.guardarCredencialesRegistro(this.correo, this.contrasena);

    // Limpiamos los campos del formulario
    this.nombreCompleto = '';
    this.dni = '';
    this.telefono = '';
    this.correo = '';
    this.contrasena = '';
    this.confirmarContrasena = '';
    this.aceptaTerminos = false;
    
    // Redirigimos al Login (Tab 1)
    this.router.navigate(['/tabs/tab1']);
  }
}