import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QuoteBlock } from './quote-block';

describe('QuoteBlock', () => {
  let fixture: ComponentFixture<QuoteBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteBlock],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteBlock);
    fixture.componentRef.setInput('data', { type: 'paragraph', text: 'Test' } as never);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
