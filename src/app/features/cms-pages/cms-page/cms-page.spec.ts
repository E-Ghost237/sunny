import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CmsPage } from './cms-page';

describe('CmsPage', () => {
  let fixture: ComponentFixture<CmsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsPage);
    fixture.componentRef.setInput('slug', 'test-slug');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
