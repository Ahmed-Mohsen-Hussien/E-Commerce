import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/services/cart.service';
import { WishlistData } from './models/wishlist-data.interface';
import { WishlistService } from './services/wishlist.service';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from '../../core/constants/storedKeys';

@Component({
  selector: 'app-wishlist',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly plat_id = inject(PLATFORM_ID);
  private readonly toastrService = inject(ToastrService);
  wishlistProducts: WritableSignal<WishlistData[]> = signal<WishlistData[]>([]);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      if (localStorage.getItem(STORED_KEYS.userToken)) {
        this.getLoggedUserWishlist();
      }
    }
  }
  getLoggedUserWishlist(): void {
    this.wishlistService.getWishlistProducts().subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.wishlistProducts.set(res.data);
          this.wishlistService.wishlistCount.set(res.count);
        }
      },
    });
  }
  removeProductFromWishlist(id: string): void {
    this.wishlistService.removeWishlistProduct(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.getLoggedUserWishlist();
        }
      },
    });
  }
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
}
