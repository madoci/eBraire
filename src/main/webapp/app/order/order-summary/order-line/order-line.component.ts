import { Component, OnInit, Input } from '@angular/core';
import { ShoppingItem } from 'app/shopping-cart/shopping-item.model';

@Component({
  selector: 'jhi-order-line',
  templateUrl: './order-line.component.html',
})
export class OrderLineComponent implements OnInit {
  @Input() item!: ShoppingItem;

  constructor() {}

  ngOnInit(): void {}

  getTotalPrice(): number {
    return this.item.quantity * this.item.book.unitPrice!;
  }
}
