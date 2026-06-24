import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: false,
})
export class GestionCitasPage implements OnInit {

  citas: any[] = [];

  constructor(private api: ApiService, private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.api.obtenerCitas().subscribe({
      next: (data: any) => {
        this.citas = data;
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }

  async cambiarEstadoSelector(cita: any) {
    const alertElement = await this.alertController.create({
      header: 'Actualizar Estado',
      subHeader: `Mascota: ${cita.mascota}`,
      mode: 'ios',
      inputs: [
        {
          type: 'radio',
          label: '⏳ Pendiente',
          value: 'PENDIENTE',
          checked: cita.estado?.toUpperCase() === 'PENDIENTE'
        },
        {
          type: 'radio',
          label: '✅ Atendido',
          value: 'ATENDIDO',
          checked: cita.estado?.toUpperCase() === 'ATENDIDO'
        },
        {
          type: 'radio',
          label: '❌ Cancelada',
          value: 'CANCELADA',
          checked: cita.estado?.toUpperCase() === 'CANCELADA'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (nuevoEstado) => {
            if (nuevoEstado) {
              
              const datosActualizados = {
                id_mascota: cita.id_mascota,
                id_veterinario: cita.id_veterinario,
                fecha: cita.fecha ? cita.fecha.split('T')[0] : '',
                hora: cita.hora,
                motivo: cita.motivo,
                estado: nuevoEstado
              };

              this.api.actualizarCita(cita.id_cita, datosActualizados).subscribe({
                next: () => {
                  this.cargarCitas();
                },
                error: (err) => {
                  console.error('Error al guardar en base de datos:', err);
                  // 💡 Usamos window.alert para evitar conflictos de nombres con Ionic
                  window.alert('No se pudo guardar el cambio de estado.');
                }
              });
            }
          }
        }
      ]
    });

    await alertElement.present();
  }

  eliminarCita(id: number, mascota: string) {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la cita de ${mascota}?`)) {
      this.api.eliminarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (err) => console.error(err)
      });
    }
  }
}