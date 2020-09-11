import { Injectable } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { ShoppingItem } from './shopping-item.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  items: ShoppingItem[] = [];

  constructor() {}

  addToCart(book: IBook, quantity: number): void {
    this.items.push(new ShoppingItem(book, quantity));
    localStorage.setItem('ShoppingCart', JSON.stringify(this.items));
  }

  clearCart(): void {
    this.items = [];
    localStorage.setItem('ShoppingCart', JSON.stringify(this.items));
  }

  getItems(): ShoppingItem[] {
    if (localStorage.getItem('ShoppingCart')) {
      this.items = JSON.parse(localStorage.getItem('ShoppingCart')!);
    }
    return this.items;
  }
}
