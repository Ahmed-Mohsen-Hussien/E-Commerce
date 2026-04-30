import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BrandsDataResponse } from '../models/brands-data.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);
  getAllBrands(): Observable<BrandsDataResponse> {
    return this.httpClient.get<BrandsDataResponse>(environment.base_url + 'brands');
  }
}
