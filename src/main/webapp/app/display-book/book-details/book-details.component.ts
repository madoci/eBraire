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

  numInCart = 0;

  constructor(public shoppingCartService: ShoppingCartService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('' + this.book.title);
    this.numInCart = this.shoppingCartService.getItems().length;
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.book, this.quantity);
    this.numInCart = this.shoppingCartService.getItems().length;
  }
}
