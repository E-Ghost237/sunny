import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPageRenderer } from './content-page-renderer';

describe('ContentPageRenderer', () => {
  let component: ContentPageRenderer;
  let fixture: ComponentFixture<ContentPageRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPageRenderer],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentPageRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
