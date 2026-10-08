import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ListBlock } from './list-block';

describe('ListBlock', () => {
  let fixture: ComponentFixture<ListBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBlock],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBlock);
    fixture.componentRef.setInput('data', { type: 'paragraph', text: 'Test' } as never);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
