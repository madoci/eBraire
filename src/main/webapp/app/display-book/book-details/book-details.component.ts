import { Component, OnInit } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-book-details',
  templateUrl: './book-details.component.html',
})
export class BookDetailsComponent implements OnInit {
  private quantity: number = 1;
  imageBlobUrl: String = '';
  constructor(private book: IBook, private shoppingCartService: ShoppingCartService, private titleService: Title) {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.book?.imageContentType + ';base64,' + this.book?.image;
    this.titleService.setTitle('' + this.book?.title);
  }

  public getBook() {
    return this.getBook;
  }

  public getQuantity() {
    return this.quantity;
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.book, this.quantity);
  }
}
