import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
  standalone: false,
})
export class Tab7Page implements OnInit {

  datosPerfil: any = {
    id_dueno: null,
    nombre: '',
    dni: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  backupPerfil: any = {}; // Copia de respaldo por si cancelan la edición
  editando: boolean = false;
  nuevaContrasena: string = ''; // Captura la contraseña temporalmente

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.cargarDatosLocal();
  }

  cargarDatosLocal() {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
      this.datosPerfil = JSON.parse(usuarioLogueado);
    }
  }

  activarEdicion() {
    // Creamos un clon exacto de los datos actuales por si el usuario se arrepiente
    this.backupPerfil = { ...this.datosPerfil };
    this.nuevaContrasena = '';
    this.editando = true;
  }

  cancelarEdicion() {
    // Restauramos los datos del respaldo y cerramos el formulario
    this.datosPerfil = { ...this.backupPerfil };
    this.editando = false;
  }

  async guardarCambiosPerfil() {
    if (!this.datosPerfil.nombre || !this.datosPerfil.telefono || !this.datosPerfil.correo) {
      alert('Los campos Nombre, Correo y Teléfono son obligatorios.');
      return;
    }

    // Preparamos el paquete de datos para la API
    const bodyActualizacion = {
      nombre: this.datosPerfil.nombre,
      dni: this.datosPerfil.dni,
      telefono: this.datosPerfil.telefono,
      direccion: this.datosPerfil.direccion,
      correo: this.datosPerfil.correo,
      contrasena: this.nuevaContrasena // Si va vacía, el backend sabe que no debe cambiarla
    };

    // Bloqueamos la pantalla con el indicador de carga
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando tu perfil en la nube...',
      spinner: 'crescent'
    });
    await loading.present();

    this.api.actualizarPerfilUsuario(this.datosPerfil.id_dueno, bodyActualizacion).subscribe({
      next: (res: any) => {
        loading.dismiss();
        alert(res.mensaje || 'Perfil actualizado exitosamente.');
        
        // Guardamos los nuevos datos devueltos por MySQL en el almacenamiento local
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.datosPerfil = res.usuario;
        
        this.editando = false;
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        alert(err.error?.error || 'Ocurrió un problema al guardar los cambios.');
      }
    });
    console.log(this.datosPerfil);
  }
  
}
