import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos las herramientas nativas que pide tu HTML
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  // ¡AQUÍ ESTÁ EL TRUCO! Le damos permiso a la página de usar todo Ionic y módulos básicos
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule
  ]
})
export class Tab4Page implements OnInit {
  constructor() { }
  ngOnInit() { }
}