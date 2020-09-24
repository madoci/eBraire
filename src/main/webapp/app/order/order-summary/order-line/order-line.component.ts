import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { IBook } from 'app/shared/model/book.model';
import { OrderSummaryComponent } from '../order-summary.component';
import { BookedBook } from '../../../shared/model/booked-book.model';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-order-line',
  templateUrl: './order-line.component.html',
})
export class OrderLineComponent implements OnInit {
  @Input() parent!: OrderSummaryComponent;
  @Input() book!: IBook;
  item!: BookedBook;
  quantity = 0;
  quantities: number[] = [];
  maxquantity = 10; // TODO : calculer cette valeur
  eventSubscriber?: Subscription;

  constructor(private shoppingCartService: ShoppingCartService, protected eventManager: JhiEventManager) {}

  ngOnInit(): void {
    this.initItem();
    this.eventSubscriber = this.eventManager.subscribe('CartModification', () => this.initItem());
  }

  getTotalPrice(): number {
    return this.item.quantity! * this.item.book!.unitPrice!;
  }

  removeItem(): void {
    this.shoppingCartService.removeAllFromCart(this.item.book!);
    this.updateItem();
  }

  changeItemQuantity(): void {
    if (this.quantity > 0) {
      if (this.quantity > this.item.quantity!) {
        this.shoppingCartService.addToCart(this.item.book!, this.quantity - this.item.quantity!);
      } else if (this.quantity < this.item.quantity!) {
        this.shoppingCartService.removeFromCart(this.item.book!, this.item.quantity! - this.quantity);
      }
    }
    this.updateItem();
  }

  addOne(): void {
    if (this.item.quantity! < this.maxquantity) {
      this.shoppingCartService.addToCart(this.item.book!, 1);
      this.updateItem();
    }
  }

  removeOne(): void {
    if (this.item.quantity! > 1) {
      this.shoppingCartService.removeFromCart(this.item.book!, 1);
      this.updateItem();
    }
  }

  private initItem(): void {
    this.item = this.shoppingCartService.getItem(this.book);
    this.quantity = this.item.quantity!;
    this.quantities = Array.from(Array(this.maxquantity).keys());
  }

  private updateItem(): void {
    this.initItem();
    this.parent.ngOnInit();
  }

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    const decArray = val.toString().split('.');
    let dec = '00';
    if (decArray.length === 1) {
      dec = '00';
    } else {
      dec = decArray[1].substring(0, 2);
      if (dec.length === 1) {
        dec = dec + '0';
      }
    }
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
