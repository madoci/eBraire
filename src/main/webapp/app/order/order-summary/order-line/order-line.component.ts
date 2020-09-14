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

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.item = this.shoppingCartService.getItem(this.book);
  }

  getTotalPrice(): number {
    return this.item.quantity * this.item.book.unitPrice!;
  }

  removeItem(): void {
    this.shoppingCartService.removeAllFromCart(this.item.book);
    this.updateItem();
  }

  changeItemQuantity(quantity: number): void {
    if (quantity > 0) {
      if (quantity > this.item.quantity) {
        this.shoppingCartService.addToCart(this.item.book, quantity - this.item.quantity);
      } else if (quantity < this.item.quantity) {
        this.shoppingCartService.removeFromCart(this.item.book, this.item.quantity - quantity);
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

  private updateItem(): void {
    this.item = this.shoppingCartService.getItem(this.book);
    this.parent.ngOnInit();
  }
}
