import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // 👈 Asegúrate de que la ruta a tu api.service sea la correcta
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab5Page implements OnInit, OnDestroy {

  listaChats: any[] = [];
  private intervaloBandeja: any;

  constructor(private apiService: ApiService, private http: HttpClient,private navCtrl: NavController) { }

  ngOnInit() {
    this.cargarBandejaAdmin();
    
    // Al ser un desarrollo temporal en memoria, haremos una consulta corta de actualización automática cada 4 segundos
    this.intervaloBandeja = setInterval(() => {
      this.cargarBandejaAdmin();
    }, 4000);
  }

  ngOnDestroy() {
    if (this.intervaloBandeja) {
      clearInterval(this.intervaloBandeja);
    }
  }

  // Obtener los datos desde el nuevo endpoint temporal de tu backend
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

  // ✨ Generador dinámico de iniciales para el avatar circular ("Franco Pacheco" -> "FP")
  obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    }
    return partes[0].slice(0, 2).toUpperCase();
  }

  // Acción al presionar una conversación estilo WhatsApp
  abrirChatEspecifico(chat: any) {
    this.navCtrl.navigateForward('/chat-admin', {
    queryParams: {
      id_dueno: chat.id_dueno,
      nombre: chat.nombre_cliente
    }
  });
  }
}