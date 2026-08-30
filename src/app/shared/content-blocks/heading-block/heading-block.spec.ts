import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingBlock } from './heading-block';

describe('HeadingBlock', () => {
  let component: HeadingBlock;
  let fixture: ComponentFixture<HeadingBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadingBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
