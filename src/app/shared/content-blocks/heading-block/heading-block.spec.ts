import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeadingBlock } from './heading-block';

describe('HeadingBlock', () => {
  let fixture: ComponentFixture<HeadingBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingBlock],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadingBlock);
    fixture.componentRef.setInput('data', { type: 'paragraph', text: 'Test' } as never);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
