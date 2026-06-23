import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarMascotasPage } from './agregar-mascotas.page';

describe('AgregarMascotasPage', () => {
  let component: AgregarMascotasPage;
  let fixture: ComponentFixture<AgregarMascotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarMascotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
