import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskUsAnything } from './ask-us-anything';

describe('AskUsAnything', () => {
  let component: AskUsAnything;
  let fixture: ComponentFixture<AskUsAnything>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskUsAnything],
    }).compileComponents();

    fixture = TestBed.createComponent(AskUsAnything);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
