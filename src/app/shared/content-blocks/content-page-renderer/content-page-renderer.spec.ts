import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ContentPageRenderer } from './content-page-renderer';

describe('ContentPageRenderer', () => {
  let fixture: ComponentFixture<ContentPageRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPageRenderer],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentPageRenderer);
    fixture.componentRef.setInput('blocks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
