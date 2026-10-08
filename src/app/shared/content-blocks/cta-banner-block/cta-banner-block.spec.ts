import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CtaBannerBlock } from './cta-banner-block';

describe('CtaBannerBlock', () => {
  let fixture: ComponentFixture<CtaBannerBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBannerBlock],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaBannerBlock);
    fixture.componentRef.setInput('data', { type: 'paragraph', text: 'Test' } as never);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
