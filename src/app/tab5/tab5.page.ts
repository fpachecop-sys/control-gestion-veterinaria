import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service'; 
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab5Page implements OnInit, OnDestroy {

  listaChats: any[] = [];
  private socket: any;

  constructor(private apiService: ApiService, private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
    // Conectamos al socket para escuchar actualizaciones
    this.socket = io(this.apiService.apiUrl);
    this.socket.on('actualizar_bandeja_admin', () => {
      this.cargarBandejaAdmin();
    });
  }

  // 🚀 CAMBIO CLAVE: Se ejecuta SIEMPRE que regresas a esta pantalla
  ionViewWillEnter() {
    this.cargarBandejaAdmin();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  cargarBandejaAdmin() {
    this.http.get<any[]>(`${this.apiService.apiUrl}/chats/bandeja`).subscribe({
      next: (data) => {
        this.listaChats = data;
      },
      error: (err) => {
        console.error('Error cargando la bandeja del chat', err);
      }
    });
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    }
    return partes[0].slice(0, 2).toUpperCase();
  }

  abrirChatEspecifico(chat: any) {
    // Truco visual (UX): Ponemos temporalmente los no leídos en 0 
    // para que la burbuja desaparezca inmediatamente al hacer click
    chat.no_leidos = 0;

    this.navCtrl.navigateForward('/chat-admin', {
      queryParams: {
        id_dueno: chat.id_dueno,
        nombre: chat.nombre_cliente
      }
    });
  }
}