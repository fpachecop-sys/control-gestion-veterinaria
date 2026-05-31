import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionVeterinariosPage } from './gestion-veterinarios.page';

describe('GestionVeterinariosPage', () => {
  let component: GestionVeterinariosPage;
  let fixture: ComponentFixture<GestionVeterinariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionVeterinariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
