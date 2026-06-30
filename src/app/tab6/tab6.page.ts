import { Component, OnInit, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: false,
})
export class Tab6Page implements OnInit, OnDestroy {
  nuevoMensaje: string = '';
  historialMensajes: any[] = [];
  usuarioLogueado: any = null;
  private socket: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuarioLogueado = JSON.parse(userStr);
      
      // Conectar al socket usando la URL de tu ApiService
      this.socket = io(this.apiService.apiUrl);

      // Unirse a su sala privada por id_dueno
      this.socket.emit('unirse_chat', this.usuarioLogueado.id_dueno);

      // Cargar historial inicial desde el backend en memoria
      this.cargarHistorialEspecitico();

      // Escuchar nuevos mensajes en tiempo real
      this.socket.on('recibir_mensaje', (msg: any) => {
        this.historialMensajes.push(msg);
      });
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  cargarHistorialEspecitico() {
    this.apiService.obtenerConversacionEspecifica(this.usuarioLogueado.id_dueno).subscribe({
      next: (data: any) => {
        this.historialMensajes = data;
        if(this.historialMensajes.length === 0) {
          // Mensaje de bienvenida por defecto si está vacío
          this.historialMensajes.push({
            mensaje: `¡Hola ${this.usuarioLogueado.nombre}! 👋 Por favor, escríbenos detalladamente el motivo de tu consulta médica y el nombre de tu mascota.`,
            remitente: 'ADMIN',
            fecha: new Date()
          });
        }
      }
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.usuarioLogueado) return;

    const payload = {
      id_dueno: this.usuarioLogueado.id_dueno,
      nombre_cliente: this.usuarioLogueado.nombre,
      remitente: 'CLIENTE', // Homologado con el backend
      mensaje: this.nuevoMensaje.trim()
    };

    // Emitir por Socket de verdad
    this.socket.emit('enviar_mensaje', payload);
    this.nuevoMensaje = '';
  }
}