import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { ShoppingItem } from 'app/shopping-cart/shopping-item.model';

@Component({
  selector: 'jhi-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent implements OnInit {
  items: ShoppingItem[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.items = this.shoppingCartService.getItems();
  }
}
