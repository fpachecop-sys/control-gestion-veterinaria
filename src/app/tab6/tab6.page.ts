import { Component, OnInit } from '@angular/core';

interface Mensaje {
  texto: string;
  remitente: 'usuario' | 'clinica';
  hora: string;
}

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: false,
})
export class Tab6Page implements OnInit {

   // Variable vinculada al input de texto
  nuevoMensaje: string = '';

  // Historial de mensajes de la conversación
  historialMensajes: Mensaje[] = [
    {
      texto: '¡Hola Franco Mariano! 👋 Por favor, escríbenos detalladamente el motivo de tu consulta médica y el nombre de tu mascota. Un administrador agendará tu caso de inmediato.',
      remitente: 'clinica',
      hora: '9:40 PM'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  /**
   * Captura el texto, genera la burbuja y limpia el campo de redacción
   */
  enviarMensaje() {
    // Validamos que el usuario no envíe un texto vacío o lleno de puros espacios
    if (!this.nuevoMensaje || this.nuevoMensaje.trim() === '') {
      return;
    }

    // Obtenemos la hora actual formateada de forma sencilla (HH:MM)
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Insertamos el nuevo mensaje del usuario al historial
    this.historialMensajes.push({
      texto: this.nuevoMensaje.trim(),
      remitente: 'usuario',
      hora: horaFormateada
    });

    console.log('Consulta enviada al administrador:', this.nuevoMensaje);

    // Limpiamos la caja de texto automáticamente
    this.nuevoMensaje = '';
  }


}
