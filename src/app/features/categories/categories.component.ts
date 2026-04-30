import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesData } from '../../core/models/categories/categories-data.interface';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { delay, retry, tap } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categoriesList: WritableSignal<CategoriesData[]> = signal<CategoriesData[]>([]);
  ngOnInit(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(retry(3))
      .subscribe({
        next: (res) => {
          this.categoriesList.set(res.data);
        },
      });
  }
}
