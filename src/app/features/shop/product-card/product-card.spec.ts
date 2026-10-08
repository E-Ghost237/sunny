import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductCard } from './product-card';
import type { Product } from '../../../core/models/product.model';

const PRODUCT_FIXTURE = {
  id: 1, slug: 'test-product', name: 'Test product', brand: 'DeLight', strain: 'Hybrid', strainName: null,
  strainDescription: null, productDescription: 'Test', thc: '20%', cbd: '0.1%', cbn: null, thcRaw: 20,
  price: 25, image: '', categorySlug: 'flower', categoryName: 'Flower', inStock: true, featured: false,
  tags: [], effects: [], flavors: [], images: [], variants: [], weight: '3.5g', rating: 4.5, reviews: 10,
} as unknown as Product;

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', PRODUCT_FIXTURE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
