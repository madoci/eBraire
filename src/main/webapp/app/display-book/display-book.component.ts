import { Component, OnInit } from '@angular/core';
import { IBook } from '../shared/model/book.model';
import { ActivatedRoute, Params } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { BookService } from '../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-display-book',
  templateUrl: './display-book.component.html',
})
export class DisplayBookComponent implements OnInit {
  book?: IBook | null;
  imageBlobUrl: String = '';

  // Style
  border = 'solid black';
  imgWidth = 500;
  borderWidth = 0;
  borderHeight = 0;
  borderSize = '';
  height = 100;
  width = 100;

  constructor(private activatedRoute: ActivatedRoute, private bookService: BookService, private titleService: Title) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params: Params) => {
          return params['bookId'];
        }),
        flatMap(id => {
          return this.bookService.find(id);
        }),
        map((res: HttpResponse<IBook>) => {
          this.book = res.body;
          this.imageBlobUrl = 'data:' + this.book!.imageContentType + ';base64,' + this.book!.image;
          this.titleService.setTitle('' + this.book!.title);
        })
      )
      .subscribe();
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
