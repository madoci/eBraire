import { Injectable } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { CustomerService } from '../entities/customer/customer.service';
import { BookedBookService } from '../entities/booked-book/booked-book.service';
import { BookedBook } from '../shared/model/booked-book.model';
import { Book } from '../shared/model/book.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  items: BookedBook[] = [];
  constructor(
    private customerService: CustomerService,
    private bookedBookService: BookedBookService,
    private router: Router,
    protected eventManager: JhiEventManager
  ) {}

  addToCart(book: IBook, quantity: number): void {
    this.addOrUpdate(book, quantity);
    this.saveCart();
  }

  removeAllFromCart(book: IBook): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].book!.id === book.id) {
        this.bookedBookService.delete(this.items[i].id!);
        this.items.splice(i, 1);
      }
    }
    this.saveCart();
  }

  removeFromCart(book: IBook, quantity: number): boolean {
    let response = false;
    if (quantity > 0) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].book!.id === book.id) {
          this.items[i].quantity! -= quantity;
          if (this.items[i].quantity! <= 0) {
            this.items.splice(i, 1);
            this.bookedBookService.delete(this.items[i].id!);
            response = true;
          } else {
            this.bookedBookService.update(this.items[i]).subscribe(temp => {
              if (temp.body !== null) {
                response = true;
              }
            });
          }
        }
      }
      this.saveCart();
    }
    return response;
  }

  clearCart(): void {
    this.items.forEach(element => {
      this.bookedBookService.delete(element.id!);
    });
    this.items = [];
    this.saveCart();
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
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].book!.id === book.id) {
          this.items[i].quantity = this.items[i].quantity! + quantity;
          this.bookedBookService.update(this.items[i]).subscribe(bookedBook => {
            if (bookedBook.body === null) {
              // cas pas trouvé le livre
              this.items.splice(i, 1);
              this.saveCart();
            } else if (bookedBook.body.quantity === 0) {
              // cas pas assez de stock
              alert('Votre réservation à expiré');
              this.items.splice(i, 1);
              this.saveCart();
            } else if (bookedBook.body.quantity !== this.items[i].quantity) {
              alert("désolé impossible de rajouter des livres à votre panier en raison d'un mnaque de stock");
              this.items[i] = bookedBook.body;
              this.saveCart();
              this.eventManager.broadcast('CartModification');
            } else {
              // cas tous vas bien
              this.items[i] = bookedBook.body;
              this.saveCart();
            }
          });
          return;
        }
      }
      const booked = new BookedBook();
      booked.quantity = quantity;
      booked.book = book;

      this.bookedBookService.create(booked).subscribe(element => {
        if (element.body === null) {
          alert('désolé rupture de stoque repassé plus tard');
          return;
        }
        this.items.push(element.body);
        this.saveCart();
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
    localStorage.setItem('ShoppingCart', JSON.stringify(this.items));
  }

  public checkCart(): void {
    let koItems = 0;
    let okItems = 0;
    const sizeItems = this.items.length;
    const tempItems: BookedBook[] = [];
    this.items.forEach(element => {
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
        }
      });
    });
  }

  public checkCartWithRoute(route: string): void {
    let koItems = 0;
    let okItems = 0;
    const sizeItems = this.items.length;
    const tempItems: BookedBook[] = [];
    this.items.forEach(element => {
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
            this.router.navigate([route]);
          }
        }
      });
    });
  }
  public getItem(book: Book): BookedBook {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].book!.id === book.id) {
        return this.items[i];
      }
    }
    return new BookedBook();
  }
  private loadCart(): void {
    if (localStorage.getItem('ShoppingCart')) {
      this.items = JSON.parse(localStorage.getItem('ShoppingCart')!);
    }
  }
}
