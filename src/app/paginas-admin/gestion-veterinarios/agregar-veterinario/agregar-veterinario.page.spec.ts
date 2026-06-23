import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarVeterinarioPage } from './agregar-veterinario.page';

describe('AgregarVeterinarioPage', () => {
  let component: AgregarVeterinarioPage;
  let fixture: ComponentFixture<AgregarVeterinarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarVeterinarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
