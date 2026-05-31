import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionDuenosPage } from './gestion-duenos.page';

describe('GestionDuenosPage', () => {
  let component: GestionDuenosPage;
  let fixture: ComponentFixture<GestionDuenosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDuenosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
