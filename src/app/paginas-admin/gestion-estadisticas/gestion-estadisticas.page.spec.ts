import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionEstadisticasPage } from './gestion-estadisticas.page';

describe('GestionEstadisticasPage', () => {
  let component: GestionEstadisticasPage;
  let fixture: ComponentFixture<GestionEstadisticasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEstadisticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
