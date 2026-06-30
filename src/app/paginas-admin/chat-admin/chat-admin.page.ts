import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.page.html',
  styleUrls: ['./chat-admin.page.scss'],
  standalone: false
})
export class ChatAdminPage implements OnInit, OnDestroy {
  idDueno!: number;
  nombreCliente: string = 'Cliente';
  nuevoMensaje: string = '';
  mensajes: any[] = [];
  private socket: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id_dueno']) {
        this.idDueno = Number(params['id_dueno']);
        this.nombreCliente = params['nombre'] || 'Cliente';
        
        // Conectar Socket
        this.socket = io(this.apiService.apiUrl);
        
        // El admin también se une a la sala del dueño para escuchar y emitir ahí
        this.socket.emit('unirse_chat', this.idDueno);

        this.obtenerConversacion();

        // Escuchar mensajes en tiempo real
        this.socket.on('recibir_mensaje', (msg: any) => {
          this.mensajes.push(msg);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  obtenerConversacion() {
    this.apiService.obtenerConversacionEspecifica(this.idDueno).subscribe({
      next: (data: any) => {
        this.mensajes = data;
      }
    });
  }

  enviarMensajeAdmin() {
    if (!this.nuevoMensaje.trim()) return;

    const payload = {
      id_dueno: this.idDueno,
      nombre_cliente: this.nombreCliente,
      remitente: 'ADMIN',
      mensaje: this.nuevoMensaje.trim()
    };

    // Emitimos por Socket
    this.socket.emit('enviar_mensaje', payload);
    this.nuevoMensaje = '';
  }
}