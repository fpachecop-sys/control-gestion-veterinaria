import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  standalone: false, // ◄--- ASEGÚRATE DE QUE DICE FALSE AQUÍ
})
export class MascotasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}