import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarConsultaPage } from './solicitar-consulta.page';

describe('SolicitarConsultaPage', () => {
  let component: SolicitarConsultaPage;
  let fixture: ComponentFixture<SolicitarConsultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
