import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'; // 👈 Importamos ViewChild
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { IonContent } from '@ionic/angular'; // 👈 Importamos IonContent
import { io } from 'socket.io-client';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.page.html',
  styleUrls: ['./chat-admin.page.scss'],
  standalone: false
})
export class ChatAdminPage implements OnInit, OnDestroy {
  // 🚀 REFERENCIA AL CONTENEDOR DEL HTML PARA EL SCROLL
  @ViewChild('miChatContent', { static: false }) content!: IonContent;

  idDueno!: number;
  nombreCliente: string = 'Cliente';
  nuevoMensaje: string = '';
  mensajes: any[] = [];
  private socket: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id_dueno']) {
        this.idDueno = Number(params['id_dueno']);
        this.nombreCliente = params['nombre'] || 'Cliente';
        
        this.socket = io(this.apiService.apiUrl);
        this.socket.emit('unirse_chat', this.idDueno);

        this.obtenerConversacion();

        this.socket.on('recibir_mensaje', (msg: any) => {
          this.mensajes.push(msg);
          this.ejecutarMarcadoComoLeido();
          
          // 🚀 MOMENTO 2: El cliente manda mensaje en vivo -> Bajar pantalla
          this.hacerScrollAlFondo(250);
        });
      }
    });
  }

  ionViewWillEnter() {
    if (this.idDueno) {
      this.ejecutarMarcadoComoLeido();
      // 🚀 Asegurar posición al reingresar a la vista si ya hay mensajes cargados
      if (this.mensajes.length > 0) {
        this.hacerScrollAlFondo(100);
      }
    }
  }

  // 🚀 CICLO DE VIDA DE IONIC: Garantiza avisar a la bandeja al salir de la pantalla
  ionViewWillLeave() {
    if (this.socket) {
      this.socket.emit('actualizar_bandeja_admin');
    }
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
        
        // 🚀 MOMENTO 1: Al abrir por primera vez la vista -> Bajar al último mensaje
        this.hacerScrollAlFondo(300);
      }
    });
  }

  ejecutarMarcadoComoLeido() {
    this.apiService.marcarMensajesComoLeidos(this.idDueno).subscribe({
      next: () => {
        console.log('Bandeja de mensajes actualizada en la base de datos de manera exitosa');
      },
      error: (err) => {
        console.error('Error al intentar marcar los mensajes como leídos:', err);
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

    this.socket.emit('enviar_mensaje', payload);
    this.nuevoMensaje = '';
    
    // 🚀 MOMENTO 3: El administrador envía una respuesta -> Empujar scroll hacia abajo inmediatamente
    this.hacerScrollAlFondo(100);
  }

  // 🎯 MANEJADOR GLOBAL DEL SCROLL AUTOMÁTICO
  hacerScrollAlFondo(duracionMs: number = 300) {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duracionMs);
      }
    }, 50);
  }
}