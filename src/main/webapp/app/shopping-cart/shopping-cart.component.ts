import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'jhi-shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent implements OnInit {
  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {}

  getNumberOfProducts(): number {
    return this.shoppingCartService.getItems().length;
  }

  goToCart(): void {
    let message: String = 'Vous avez commandé : ';
    for (const item of this.shoppingCartService.getItems()) {
      message += item.book.title! + ', ';
    }
    window.alert(message);
  }
}
