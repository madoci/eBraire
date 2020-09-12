import { Component, OnInit, Input } from '@angular/core';
import { IBook, Book } from 'app/shared/model/book.model';
import { ShoppingCartService } from 'app/shopping-cart/shopping-cart.service';
import { Title } from '@angular/platform-browser';
import { Tag } from '../../shared/model/tag.model';

@Component({
  selector: 'jhi-book-details',
  templateUrl: './book-details.component.html',
})
export class BookDetailsComponent implements OnInit {
  @Input() book: IBook = new Book();

  quantity = 1;
  numInCart = 0;

  // Style
  organizedTags?: Tag[][];
  maxChar = 30;

  constructor(public shoppingCartService: ShoppingCartService, private titleService: Title) {}

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
  }
}
