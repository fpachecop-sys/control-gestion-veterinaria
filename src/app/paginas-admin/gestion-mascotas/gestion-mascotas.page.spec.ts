import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionMascotasPage } from './gestion-mascotas.page';

describe('GestionMascotasPage', () => {
  let component: GestionMascotasPage;
  let fixture: ComponentFixture<GestionMascotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMascotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
