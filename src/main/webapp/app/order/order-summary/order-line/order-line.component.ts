import { Component, OnInit, Input } from '@angular/core';
import { ShoppingItem } from 'app/shopping-cart/shopping-item.model';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { IBook } from 'app/shared/model/book.model';
import { OrderSummaryComponent } from '../order-summary.component';

@Component({
  selector: 'jhi-order-line',
  templateUrl: './order-line.component.html',
})
export class OrderLineComponent implements OnInit {
  @Input() parent!: OrderSummaryComponent;
  @Input() book!: IBook;
  item!: ShoppingItem;
  quantity = 0;
  quantities: number[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.initItem();
  }

  getTotalPrice(): number {
    return this.item.quantity * this.item.book.unitPrice!;
  }

  removeItem(): void {
    this.shoppingCartService.removeAllFromCart(this.item.book);
    this.updateItem();
  }

  changeItemQuantity(): void {
    if (this.quantity > 0) {
      if (this.quantity > this.item.quantity) {
        this.shoppingCartService.addToCart(this.item.book, this.quantity - this.item.quantity);
      } else if (this.quantity < this.item.quantity) {
        this.shoppingCartService.removeFromCart(this.item.book, this.item.quantity - this.quantity);
      }
    }
    this.updateItem();
  }

  addOne(): void {
    this.shoppingCartService.addToCart(this.item.book, 1);
    this.updateItem();
  }

  removeOne(): void {
    if (this.item.quantity > 1) {
      this.shoppingCartService.removeFromCart(this.item.book, 1);
      this.updateItem();
    }
  }

  private initItem(): void {
    this.item = this.shoppingCartService.getItem(this.book);
    this.quantity = this.item.quantity;
    this.quantities = Array.from(Array(10).keys());
  }

  private updateItem(): void {
    this.initItem();
    this.parent.ngOnInit();
  }
}
