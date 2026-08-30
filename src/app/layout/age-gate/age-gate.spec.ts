import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeGate } from './age-gate';

describe('AgeGate', () => {
  let component: AgeGate;
  let fixture: ComponentFixture<AgeGate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeGate],
    }).compileComponents();

    fixture = TestBed.createComponent(AgeGate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
