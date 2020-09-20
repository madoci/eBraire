import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IBook, Book } from 'app/shared/model/book.model';

@Component({
  selector: 'jhi-book-image',
  templateUrl: './book-image.component.html',
})
export class BookImageComponent implements OnInit, OnChanges {
  @Input() book: IBook = new Book();
  @Input() imgSize = 500;
  @Input() borderColor = '#000000';
  imageBlobUrl = '';

  // Style
  id = 'img';
  border = 'solid ' + this.borderColor;
  borderWidth = 0;
  borderHeight = 0;
  borderSize = '';
  height = 200;
  width = 200;

  constructor() {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.book.imageContentType + ';base64,' + this.book.image;
    this.border = 'solid ' + this.borderColor;
    this.id = this.book.id!.toString();
  }

  img(): void {
    const image = document.getElementById(this.id.toString()) as HTMLImageElement;
    if (image) {
      if (image.naturalHeight > image.naturalWidth) {
        const coeff = (this.imgSize * image.naturalWidth) / image.naturalHeight / this.imgSize;
        this.borderWidth = ((1 - coeff) * this.imgSize) / 2;
      } else {
        const coeff = (this.imgSize * image.naturalHeight) / image.naturalWidth / this.imgSize;
        this.borderHeight = ((1 - coeff) * this.imgSize) / 2;
      }
      this.height = this.imgSize;
      this.width = this.imgSize;
      this.borderSize = Math.floor(this.borderHeight) + 'px ' + Math.floor(this.borderWidth) + 'px';
    }
  }

  ngOnChanges(): void {
    this.img();
  }
}
