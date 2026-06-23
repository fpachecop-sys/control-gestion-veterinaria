import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service'; // 🚀 Asegúrate de apuntar bien a tu servicio
import { forkJoin } from 'rxjs'; // Para disparar peticiones en simultáneo

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {

  // Variables dinámicas para los contadores superiores
  totalDuenos: number = 0;
  totalMascotas: number = 0;
  citasPendientes: number = 0;

  // Arreglo dinámico que manejará las filas de la tabla inferior
  citasRecientes: any[] = [];

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService,
    private api: ApiService // 🚀 Inyectamos el servicio central
  ) {}

  ngOnInit() {
  }

  // 🚀 Se ejecuta SIEMPRE que entras a la vista del Dashboard
  ionViewWillEnter() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    // forkJoin ejecuta las 3 peticiones al mismo tiempo y espera que terminen todas
    forkJoin({
      duenos: this.api.obtenerDuenos(),
      mascotas: this.api.obtenerMascotas(),
      citas: this.api.obtenerCitas()
    }).subscribe({
      next: (res: any) => {
        // 1. Asignamos los contadores contando los elementos de las tablas
        this.totalDuenos = res.duenos?.length || 0;
        this.totalMascotas = res.mascotas?.length || 0;

        // 2. Filtramos cuántas citas en la base de datos tienen estado "PENDIENTE"
        const listadoCitas = res.citas || [];
        this.citasPendientes = listadoCitas.filter((c: any) => c.estado?.toUpperCase() === 'PENDIENTE').length;

        // 3. Pasamos todas las citas a la tabla inferior (las más recientes arriba)
        this.citasRecientes = listadoCitas;
        console.log('Dashboard cargado perfectamente desde la Base de Datos.');
      },
      error: (err) => {
        console.error('Error cargando las métricas en tiempo real:', err);
      }
    });
  }

  /**
   * Cierra la sesión del administrador, limpia los datos locales y regresa al login
   */
  logout() {
    console.log('Cerrando sesión del administrador...');
    this.authService.clearSession();
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}