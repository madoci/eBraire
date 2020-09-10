import { Injectable } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { ShoppingItem } from './shopping-item.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  items: ShoppingItem[] = [];

  constructor() {}

  addToCart(book: IBook, quantity: number) {
    this.items.push(new ShoppingItem(book, quantity));
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
