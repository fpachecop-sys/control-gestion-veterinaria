import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  registrarCuenta(){
   if (this.nombreCompleto === '' || this.dni === '' || this.telefono === '' || 
        this.correo === '' || this.contrasena === '' || this.confirmarContrasena === '') {
      alert('Por favor, completa todos los campos del formulario.');
      return;
  }

  if(this.contrasena!==this.confirmarContrasena){
    alert('Las contraseña no coinciden')
    return;
  } 
  if(this.aceptaTerminos == false){
    alert('Debes aceptar los Tèrminos y Condiciones para completar el registro')
    return;
  }

  alert('Cuenta registrada con èxito');

  this.nombreCompleto = '';
    this.dni = '';
    this.telefono = '';
    this.correo = '';
    this.contrasena = '';
    this.confirmarContrasena = '';
    this.aceptaTerminos = false;
    
    this.router.navigate(['/tabs/tab1']);
  }
}
