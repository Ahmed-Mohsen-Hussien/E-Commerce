import { WishlistService } from './../../../features/wishlist/services/wishlist.service';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/auth.service';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from '../../../core/constants/storedKeys';
import { ChangePasswordService } from './services/change-password.service';
interface Language {
  code: string;
  label: string;
}
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Input({ required: true }) isLogin!: boolean;
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly plat_id = inject(PLATFORM_ID);
  count: Signal<number> = computed(() => this.cartService.cartCount());
  wishlistProductsCount: Signal<number> = computed(() => this.wishlistService.wishlistCount());
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
      if (isPlatformBrowser(this.plat_id)) {
        const token = localStorage.getItem(STORED_KEYS.userToken);
        if (token) {
          this.getAllUserData();
          this.getAllWishlistData();
        }
      }
    });
  }
  getAllUserData(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
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
  onSignOut(): void {
    this.authService.signOut();
  }
  private readonly translateService = inject(TranslateService);
  private readonly renderer = inject(Renderer2);
  isOpen = false;
  openSetting = false;
  languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'de', label: 'German' },
  ];
  selected: Language = { code: this.translateService.getCurrentLang(), label: 'English' };
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  toggleSetting(): void {
    this.openSetting = !this.openSetting;
  }
  closeSetting(): void {
    this.openSetting = false;
  }
  closeDropdown(): void {
    this.isOpen = false;
  }
  selectLanguage(lang: Language): void {
    this.selected = lang;
    this.isOpen = false;
    this.translateService.use(lang.code);
    this.renderer.setAttribute(document.documentElement, 'lang', lang.code);
    this.renderer.setAttribute(document.documentElement, 'dir', lang.code === 'ar' ? 'rtl' : 'ltr');
  }
  private readonly ele = inject(ElementRef);
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.ele.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.openSetting = false;
    }
  }
}
