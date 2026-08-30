import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityStepper } from './quantity-stepper';

describe('QuantityStepper', () => {
  let component: QuantityStepper;
  let fixture: ComponentFixture<QuantityStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
