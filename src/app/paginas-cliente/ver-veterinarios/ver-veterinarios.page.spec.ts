import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerVeterinariosPage } from './ver-veterinarios.page';

describe('VerVeterinariosPage', () => {
  let component: VerVeterinariosPage;
  let fixture: ComponentFixture<VerVeterinariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerVeterinariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
