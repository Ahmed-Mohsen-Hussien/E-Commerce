import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductsDataResponse } from '../../models/products/products-data.interface';
import { ProductDetailsResponse } from '../../../features/products/models/product-details.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  getAllProducts(page: number = 1, limit: number = 10): Observable<ProductsDataResponse> {
    return this.httpClient.get<ProductsDataResponse>(
      environment.base_url + `products?page=${page}&limit=${limit}`,
    );
  }
  getProductDetails(id: string | null): Observable<ProductDetailsResponse> {
    return this.httpClient.get<ProductDetailsResponse>(environment.base_url + `products/${id}`);
  }
}
