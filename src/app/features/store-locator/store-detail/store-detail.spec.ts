import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StoreDetail } from './store-detail';

describe('StoreDetail', () => {
  let fixture: ComponentFixture<StoreDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreDetail);
    fixture.componentRef.setInput('slug', 'test-slug');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
