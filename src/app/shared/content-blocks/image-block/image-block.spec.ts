import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBlock } from './image-block';

describe('ImageBlock', () => {
  let component: ImageBlock;
  let fixture: ComponentFixture<ImageBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
