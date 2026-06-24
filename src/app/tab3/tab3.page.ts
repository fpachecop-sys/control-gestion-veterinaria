import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service'; // 🚀 Asegúrate de mapear la ruta correcta a tu api.service

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  nombreUsuario: string = 'Usuario';
  proximasCitas: any[] = [];
  cargando: boolean = true;

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService,
    private api: ApiService // 🚀 Inyectamos el ApiService
  ) {}

  ionViewWillEnter() {
    const usuarioLogueado = localStorage.getItem('usuario'); 
    if (usuarioLogueado) {
      const usuario = JSON.parse(usuarioLogueado);
      this.nombreUsuario = usuario.nombre.split(' ')[0]; 
      
      // 🚀 Cargamos sus próximas citas reales
      this.obtenerCitasProximas(usuario.id_dueno);
    } else {
      this.nombreUsuario = 'Usuario';
      this.cargando = false;
    }
  }

  obtenerCitasProximas(idDueno: number) {
    this.api.obtenerCitasPorDueno(idDueno).subscribe({
      next: (data: any) => {
        // Filtrar para mostrar solo las citas "Pendientes" en el Home
        this.proximasCitas = data.filter((cita: any) => cita.estado?.toLowerCase() === 'pendiente');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar próximas citas en Home:', err);
        this.cargando = false;
      }
    });
  }

  // 🛠️ Funciones Helper para desestructurar la fecha SQL (YYYY-MM-DD) y enviarla al bloque verde
  obtenerDia(fechaString: string): string {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return '00';
    // Usamos el método UTC para evitar desfases de zonas horarias en bases de datos locales
    return String(fecha.getUTCDate()).padStart(2, '0');
  }

  obtenerMesAbraviado(fechaString: string): string {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'MES';
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'];
    return meses[fecha.getUTCDate() - 1];
  }

  logout() {
    console.log('Cerrando sesión del cliente...');
    localStorage.removeItem('usuario'); 
    localStorage.removeItem('dniClienteLogueado'); 
    this.authService.clearSession();
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}