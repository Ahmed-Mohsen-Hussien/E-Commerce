import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { STORED_KEYS } from '../../core/constants/storedKeys';
import { AllordersService } from './services/allorders.service';
import { Orders } from './models/allorders.interface';
import { DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly allordersService = inject(AllordersService);
  private readonly plat_id = inject(PLATFORM_ID);
  ordersList: WritableSignal<Orders[]> = signal<Orders[]>([]);
  userID: string | null = null;
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      this.userID = localStorage.getItem(STORED_KEYS.userId);
      if (this.userID) {
        this.getLoggedUserOrders();
      }
    }
  }
  getLoggedUserOrders(): void {
    this.allordersService.getUserOrders(this.userID).subscribe({
      next: (res) => {
        this.ordersList.set(res.reverse());
      },
    });
  }
}
