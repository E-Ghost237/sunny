import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphBlock } from './paragraph-block';

describe('ParagraphBlock', () => {
  let component: ParagraphBlock;
  let fixture: ComponentFixture<ParagraphBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
