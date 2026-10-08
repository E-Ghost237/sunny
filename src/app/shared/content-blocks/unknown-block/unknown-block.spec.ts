import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UnknownBlock } from './unknown-block';

describe('UnknownBlock', () => {
  let fixture: ComponentFixture<UnknownBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnknownBlock],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UnknownBlock);
    fixture.componentRef.setInput('data', { type: 'paragraph', text: 'Test' } as never);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
