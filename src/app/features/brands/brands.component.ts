import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsData } from './models/brands-data.interface';
import { BrandsService } from './services/brands.service';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  brandList: WritableSignal<BrandsData[]> = signal<BrandsData[]>([]);
  ngOnInit(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandList.set(res.data);
      },
    });
  }
}
