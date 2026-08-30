import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBlock } from './list-block';

describe('ListBlock', () => {
  let component: ListBlock;
  let fixture: ComponentFixture<ListBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
