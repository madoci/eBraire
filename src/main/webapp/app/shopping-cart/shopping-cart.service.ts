import { Injectable } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { Customer } from '../shared/model/customer.model';
import { CustomerService } from '../entities/customer/customer.service';
import { BookedBookService } from '../entities/booked-book/booked-book.service';
import { BookedBook } from '../shared/model/booked-book.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  items: BookedBook[] = [];
  customer: Customer | null = null;
  constructor(private customerService: CustomerService, private bookedBookService: BookedBookService) {}

  addToCart(book: IBook, quantity: number): void {
    if (!this.customer) {
      this.customer = new Customer();
      this.customer.address = '';
      this.customer.lastName = '';
      this.customer.name = '';
      this.customerService.create(this.customer).subscribe(result => {
        this.customer = result.body || this.customer;
        localStorage.setItem('Customer', JSON.stringify(this.customer!));
        this.addOrUpdate(book, quantity);
        this.saveCart();
      });
    } else {
      this.addOrUpdate(book, quantity);
      this.saveCart();
    }
  }

  removeAllFromCart(book: IBook): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].book!.id === book.id) {
        this.items.splice(i, 1);
      }
    }
    this.saveCart();
  }

  removeFromCart(book: IBook, quantity: number): void {
    if (quantity > 0) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].book!.id === book.id) {
          this.items[i].quantity! -= quantity;
          if (this.items[i].quantity! <= 0) {
            this.items.splice(i, 1);
          }
        }
      }
      this.saveCart();
    }
  }

  clearCart(): void {
    if (this.customer!.id) {
      this.bookedBookService.deleteFromCustomer(this.customer!.id || 0).subscribe(() => {
        this.customerService.delete(this.customer!.id || 0);
        this.items = [];
        this.customer = null;
        this.saveCart();
      });
    }
  }

  getItems(): BookedBook[] {
    this.loadCart();
    return this.items;
  }

  getNumberOfItems(): number {
    let numberOfItems = 0;
    for (const item of this.getItems()) {
      numberOfItems += item.quantity!;
    }
    return numberOfItems;
  }

  private addOrUpdate(book: IBook, quantity: number): void {
    if (quantity > 0) {
      for (const item of this.items) {
        if (item.book!.id === book.id) {
          item.quantity = item.quantity! + quantity;

          this.bookedBookService.update(item).subscribe(bookedBook => {
            if (bookedBook.body === null) {
              alert('Pas assez de sotck pour en réserver plus');
              item.quantity = item.quantity! - quantity;
            }
          });
          return;
        }
      }
      const booked = new BookedBook();
      booked.quantity = quantity;
      booked.book = book;
      if (this.customer) {
        booked.customer = this.customer;
      }
      this.bookedBookService.create(booked).subscribe(element => {
        if (element.body === null) {
          alert('désolé rupture de stoque repassé plus tad :)');
        } else {
          this.items.push(element.body || new BookedBook());
          this.saveCart();
        }
      });
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<BookedBook>>): void {
    result.subscribe(
      () => alert('sucess'),
      () => alert('Fail')
    );
  }
  private saveCart(): void {
    localStorage.setItem('Customer', JSON.stringify(this.customer!));
    localStorage.setItem('ShoppingCart', JSON.stringify(this.items));
  }

  public checkCart(): void {
    let koItems = 0;
    let okItems = 0;
    const sizeItems = this.items.length;
    const tempItems: BookedBook[] = [];
    this.items.forEach(element => {
      alert(element.quantity!);
      this.bookedBookService.publicCheckBookedBook(element).subscribe(resp => {
        if (resp.body! === null) {
          alert('Votre commande pour le livre :' + element.book!.title! + "a expirer et il n'y a plus assez de stock :(");
          koItems = koItems + 1;
          if (okItems + koItems === sizeItems) {
            this.items = tempItems;
            this.saveCart();
          }
        } else {
          const newBookedbook: BookedBook = resp.body || new BookedBook();
          tempItems.push(newBookedbook);
          okItems = okItems + 1;
          if (okItems + koItems === sizeItems) {
            this.items = tempItems;
            this.saveCart();
          }
          if (okItems === sizeItems) {
            alert('vos réservation sont à jour keep going!');
          }
        }
      });
    });
  }

  private loadCart(): void {
    if (localStorage.getItem('ShoppingCart')) {
      this.items = JSON.parse(localStorage.getItem('ShoppingCart')!);
    }

    if (localStorage.getItem('Customer')) {
      this.customer = JSON.parse(localStorage.getItem('Customer')!);
    }
  }
}
