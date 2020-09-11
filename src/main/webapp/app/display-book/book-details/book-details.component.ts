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

  numInCart = 0;
  // Style
  border = 'solid black';
  imgWidth = 500;
  borderWidth = 0;
  borderHeight = 0;
  borderSize = '';
  height = 100;
  width = 100;

  constructor(public shoppingCartService: ShoppingCartService, private titleService: Title) {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.book.imageContentType + ';base64,' + this.book.image;
    this.titleService.setTitle('' + this.book.title);
    this.numInCart = this.shoppingCartService.getItems().length;
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.book, this.quantity);
    this.numInCart = this.shoppingCartService.getItems().length;
  }

  img(): void {
    const image = document.getElementById('img') as HTMLImageElement;
    if (image.naturalHeight > image.naturalWidth) {
      const coeff = (this.imgWidth * image.naturalWidth) / image.naturalHeight / this.imgWidth;
      this.height = this.imgWidth;
      image.style.width = 'auto';
      this.borderWidth = ((1 - coeff) * this.imgWidth) / 2;
    } else {
      const coeff = (this.imgWidth * image.naturalHeight) / image.naturalWidth / this.imgWidth;
      this.width = this.imgWidth;
      image.style.height = 'auto';
      this.borderHeight = ((1 - coeff) * this.imgWidth) / 2;
    }
    this.borderSize = Math.floor(this.borderHeight) + 'px ' + Math.floor(this.borderWidth) + 'px';
  }
}
