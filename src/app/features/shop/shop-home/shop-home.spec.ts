import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHome } from './shop-home';

describe('ShopHome', () => {
  let component: ShopHome;
  let fixture: ComponentFixture<ShopHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
