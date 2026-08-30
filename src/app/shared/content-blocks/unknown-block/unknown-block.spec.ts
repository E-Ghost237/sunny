import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownBlock } from './unknown-block';

describe('UnknownBlock', () => {
  let component: UnknownBlock;
  let fixture: ComponentFixture<UnknownBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnknownBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(UnknownBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
