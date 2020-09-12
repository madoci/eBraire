import { Component, OnInit, Input } from '@angular/core';
import { IBook, Book } from 'app/shared/model/book.model';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-book-details',
  templateUrl: './book-details.component.html',
})
export class BookDetailsComponent implements OnInit {
  @Input() book: IBook = new Book();
  quantity = 1;
  imageBlobUrl = '';
  deleteQuantity = 0;

  constructor(public shoppingCartService: ShoppingCartService, private titleService: Title) {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.book.imageContentType + ';base64,' + this.book.image;
    this.titleService.setTitle('' + this.book.title);
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.book, this.quantity);
  }

  removeFromCart(): void {
    if (this.deleteQuantity > 0) {
      this.shoppingCartService.removeFromCart(this.book, this.deleteQuantity);
    } else {
      this.shoppingCartService.removeFromCart(this.book);
    }
  }
}
