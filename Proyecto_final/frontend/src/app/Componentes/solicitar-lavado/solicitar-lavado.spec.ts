import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarLavado } from './solicitar-lavado';

describe('SolicitarLavado', () => {
  let component: SolicitarLavado;
  let fixture: ComponentFixture<SolicitarLavado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarLavado],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarLavado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
