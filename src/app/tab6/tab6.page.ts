import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'; // 👈 Importamos ViewChild
import { IonContent } from '@ionic/angular'; // 👈 Importamos IonContent
import { io } from 'socket.io-client';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: false,
})
export class Tab6Page implements OnInit, OnDestroy {
  // 🚀 REFRENCIA AL CONTENEDOR DEL HTML
  @ViewChild('miChatContent', { static: false }) content!: IonContent;

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
        
        // 🚀 MOMENTO 2: Cuando entra un mensaje del Admin en vivo, baja suavemente
        this.hacerScrollAlFondo(250);
      });
    }
  }

  // 🚀 CICLO DE VIDA DE IONIC: Se ejecuta cuando la pestaña se vuelve activa en pantalla
  ionViewWillEnter() {
    if (this.historialMensajes.length > 0) {
      this.hacerScrollAlFondo(100);
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
          this.historialMensajes.push({
            mensaje: `¡Hola ${this.usuarioLogueado.nombre}! 👋 Por favor, escríbenos detalladamente el motivo de tu consulta médica y el nombre de tu mascota.`,
            remitente: 'ADMIN',
            fecha: new Date()
          });
        }
        
        // 🚀 MOMENTO 1: Cuando los mensajes terminan de cargar desde la API al iniciar, baja al fondo
        this.hacerScrollAlFondo(300);
      }
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.usuarioLogueado) return;

    const payload = {
      id_dueno: this.usuarioLogueado.id_dueno,
      nombre_cliente: this.usuarioLogueado.nombre,
      remitente: 'CLIENTE',
      mensaje: this.nuevoMensaje.trim()
    };

    // Emitir por Socket de verdad
    this.socket.emit('enviar_mensaje', payload);
    this.nuevoMensaje = '';

    // 🚀 MOMENTO 3: Inmediatamente después de enviar el texto para no perder la burbuja propia
    this.hacerScrollAlFondo(100);
  }

  // 🎯 CONTROLADOR GLOBAL DEL SCROLL AUTOMÁTICO
  hacerScrollAlFondo(duracionMs: number = 300) {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duracionMs);
      }
    }, 50); // Mantiene una holgura de 50ms para que Angular pinte las directivas antes del movimiento
  }
}