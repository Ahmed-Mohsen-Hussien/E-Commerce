import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductDetails } from '../products/models/product-details.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  productData: WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails);
  productId: string | null = null;
  ngOnInit(): void {
    this.getProductId();
    this.getProductDetailsData();
  }
  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
      },
    });
  }
  getProductDetailsData(): void {
    this.productsService.getProductDetails(this.productId).subscribe({
      next: (res) => {
        this.productData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
