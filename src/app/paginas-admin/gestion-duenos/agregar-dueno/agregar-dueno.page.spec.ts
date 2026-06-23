import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDuenoPage } from './agregar-dueno.page';

describe('AgregarDuenoPage', () => {
  let component: AgregarDuenoPage;
  let fixture: ComponentFixture<AgregarDuenoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDuenoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
