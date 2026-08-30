import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaBannerBlock } from './cta-banner-block';

describe('CtaBannerBlock', () => {
  let component: CtaBannerBlock;
  let fixture: ComponentFixture<CtaBannerBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBannerBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaBannerBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
