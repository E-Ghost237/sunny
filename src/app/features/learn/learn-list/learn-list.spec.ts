import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnList } from './learn-list';

describe('LearnList', () => {
  let component: LearnList;
  let fixture: ComponentFixture<LearnList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnList],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
