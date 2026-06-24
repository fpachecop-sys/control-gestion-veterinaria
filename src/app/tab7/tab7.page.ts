import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
  standalone: false,
})
export class Tab7Page implements OnInit {
  // Objeto molde vacío para evitar errores antes de que carguen los datos
  datosPerfil: any = {
    nombre: '',
    dni: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  constructor() { }

  ngOnInit() {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
      this.datosPerfil = JSON.parse(usuarioLogueado);
    }
  }
}