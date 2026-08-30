import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatBar } from './cat-bar';

describe('CatBar', () => {
  let component: CatBar;
  let fixture: ComponentFixture<CatBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatBar],
    }).compileComponents();

    fixture = TestBed.createComponent(CatBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
