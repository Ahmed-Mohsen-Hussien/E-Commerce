import { WishlistService } from './../../../features/wishlist/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsData } from '../../../core/models/products/products-data.interface';
import { SplitPipe } from '../../pipes/split-pipe';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CurrencyPipe, SplitPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() data: ProductsData = {} as ProductsData;
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  addProdcutItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      },
    });
  }
  addProductToWishlist(id: string): void {
    this.wishlistService.addToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.getAllWishlistData();
        }
      },
    });
  }
  getAllWishlistData(): void {
    this.wishlistService.getWishlistProducts().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count);
      },
    });
  }
}
