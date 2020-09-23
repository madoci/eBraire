import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { ShoppingItem } from 'app/shopping-cart/shopping-item.model';
import { BookedBook } from '../../shared/model/booked-book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent implements OnInit {
  items: BookedBook[] = [];
  finalPrice = 0;
  numberOfItems = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    //this.shoppingCartService.clearCart();
    //this.shoppingCartService.checkCart();
    this.items = this.shoppingCartService.getItems();
    this.numberOfItems = this.shoppingCartService.getNumberOfItems();
    this.calcFinalPrice();
  }

  calcFinalPrice(): void {
    this.finalPrice = 0;
    this.items.forEach(element => {
      this.finalPrice += element.quantity! * element.book!.unitPrice!;
    });
  }

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    let dec = ((val - Math.floor(val)) * 10).toString();
    dec = dec.length === 1 ? dec + '0' : dec;
    return Math.trunc(val).toString() + ',' + dec + '€';
  }

  tryToOrder(): void {
    this.shoppingCartService.checkCartWithRoute('/order');
  }
}
