import { Component, OnInit, Input } from '@angular/core';
import { IBook, Book } from 'app/shared/model/book.model';

@Component({
  selector: 'jhi-book-image',
  templateUrl: './book-image.component.html',
})
export class BookImageComponent implements OnInit {
  @Input() book: IBook = new Book();
  @Input() imgSize = 500;
  imageBlobUrl = '';

  // Style
  border = 'solid black';
  borderWidth = 0;
  borderHeight = 0;
  borderSize = '';
  height = 100;
  width = 100;

  constructor() {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.book.imageContentType + ';base64,' + this.book.image;
  }

  img(): void {
    const image = document.getElementById('img') as HTMLImageElement;
    if (image.naturalHeight > image.naturalWidth) {
      const coeff = (this.imgSize * image.naturalWidth) / image.naturalHeight / this.imgSize;
      this.height = this.imgSize;
      image.style.width = 'auto';
      this.borderWidth = ((1 - coeff) * this.imgSize) / 2;
    } else {
      const coeff = (this.imgSize * image.naturalHeight) / image.naturalWidth / this.imgSize;
      this.width = this.imgSize;
      image.style.height = 'auto';
      this.borderHeight = ((1 - coeff) * this.imgSize) / 2;
    }
    this.borderSize = Math.floor(this.borderHeight) + 'px ' + Math.floor(this.borderWidth) + 'px';
  }
}
