import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RangeSlider } from './range-slider';

describe('RangeSlider', () => {
  let fixture: ComponentFixture<RangeSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSlider],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeSlider);
    fixture.componentRef.setInput('boundMin', 0);
    fixture.componentRef.setInput('boundMax', 100);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
