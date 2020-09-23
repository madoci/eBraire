import { HostListener, Component, OnInit, Input } from '@angular/core';
import { IBook, Book } from 'app/shared/model/book.model';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { Title } from '@angular/platform-browser';
import { Tag } from '../../shared/model/tag.model';
import { WindowRef } from '../../catalogue/window/window.component';

@Component({
  selector: 'jhi-book-details',
  templateUrl: './book-details.component.html',
})
export class BookDetailsComponent implements OnInit {
  @Input() book: IBook = new Book();

  quantity = 1;

  deleteQuantity = 0;
  numInCart = 0;
  itemsInDatabase = 5; // valeur à modifier selon les stocks

  // Style
  organizedTags?: Tag[][];
  maxChar = 30;
  width = 0;
  window: Window;

  constructor(public shoppingCartService: ShoppingCartService, private titleService: Title, public winRef: WindowRef) {
    this.width = winRef.nativeWindow.innerWidth;
    this.window = winRef.nativeWindow;
  }

  ngOnInit(): void {
    this.titleService.setTitle('' + this.book.title);
    this.organizedTags = [[]];
    if (this.book.tags) {
      let currentChar = 0;
      let currentTab = 0;
      let currentTag = 0;
      while (currentTag < this.book.tags.length) {
        this.organizedTags[currentTab].push(this.book.tags[currentTag]);
        currentChar += this.book.tags[currentTag].tag!.length;
        if (currentChar > this.maxChar) {
          currentChar = 0;
          this.organizedTags.push([]);
          currentTab++;
        }
        currentTag++;
      }
    }
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.book, this.quantity);
    const s = this.quantity > 1 ? 's' : '';
    alert('Vous avez ajouté ' + this.quantity + ' article' + s + ' à votre panier.');
  }

  removeFromCart(): void {
    if (this.deleteQuantity > 0) {
      this.shoppingCartService.removeFromCart(this.book, this.deleteQuantity);
    } else {
      this.shoppingCartService.removeAllFromCart(this.book);
    }
  }

  getTotalPrice(): number {
    return this.quantity * (this.book.unitPrice ? this.book.unitPrice : 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.width = event.target.innerWidth;
  }

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    let dec = ((val - Math.floor(val)) * 10).toString();
    dec = dec.length === 1 ? dec + '0' : dec;
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
