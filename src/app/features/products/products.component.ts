import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { ProductsData } from '../../core/models/products/products-data.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchPipe } from '../../shared/pipes/search-pipe';
@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList: WritableSignal<ProductsData[]> = signal<ProductsData[]>([]);
  searchWord: string = '';
  pagination: PaginationInstance = {
    id: 'products',
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.getAllProductsData();
  }
  getAllProductsData(): void {
    this.productsService
      .getAllProducts(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (res) => {
          this.productList.set(res.data);
          this.pagination.totalItems = res.results;
        },
      });
  }
  pageChanged(page: number): void {
    this.pagination.currentPage = page;
    this.getAllProductsData();
  }
}
