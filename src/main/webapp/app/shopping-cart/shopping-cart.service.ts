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
    this.addOrUpdate(book, quantity);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getItems(): ShoppingItem[] {
    this.loadCart();
    return this.items;
  }

  getNumberOfItems(): number {
    let numberOfItems = 0;
    for (const item of this.items) {
      numberOfItems += item.quantity;
    }
    return numberOfItems;
  }

  private addOrUpdate(book: IBook, quantity: number): boolean {
    for (const item of this.items) {
      if (item.book.id === book.id) {
        item.quantity += quantity;
        return true;
      }
    }
    this.items.push(new ShoppingItem(book, quantity));
    return false;
  }

  private saveCart(): void {
    localStorage.setItem('ShoppingCart', JSON.stringify(this.items));
  }

  private loadCart(): void {
    if (localStorage.getItem('ShoppingCart')) {
      this.items = JSON.parse(localStorage.getItem('ShoppingCart')!);
    }
  }
}
