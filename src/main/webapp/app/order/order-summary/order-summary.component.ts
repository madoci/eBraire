import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { BookedBook } from '../../shared/model/booked-book.model';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent implements OnInit {
  items: BookedBook[] = [];
  finalPrice = 0;
  numberOfItems = 0;
  eventSubscriber?: Subscription;

  constructor(private shoppingCartService: ShoppingCartService, protected eventManager: JhiEventManager) {}

  ngOnInit(): void {
    document.bgColor = '#AAAAAA';
    this.items = this.shoppingCartService.getItems();
    this.numberOfItems = this.shoppingCartService.getNumberOfItems();
    this.calcFinalPrice();
    this.eventSubscriber = this.eventManager.subscribe('CartModification', () => {
      this.numberOfItems = this.shoppingCartService.getNumberOfItems();
      this.items = this.shoppingCartService.getItems();
      this.calcFinalPrice();
    });
  }

  calcFinalPrice(): void {
    this.finalPrice = 0;
    this.items.forEach(element => {
      this.finalPrice += element.quantity! * element.book!.unitPrice!;
    });
  }

  getS(num: number): string {
    return num > 1 ? 'S' : '';
  }

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    const dec = Math.round((val - Math.floor(val)) * 100).toString();
    return Math.trunc(val).toString() + ',' + dec + '€';
  }

  tryToOrder(): void {
    this.shoppingCartService.checkCartWithRoute('/order');
  }
}
