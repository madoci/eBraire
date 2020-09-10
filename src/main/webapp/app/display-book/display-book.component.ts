import { Component, OnInit } from '@angular/core';
import { IBook } from 'app/shared/model/book.model';
import { ActivatedRoute, Params } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { BookService } from 'app/entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-display-book',
  templateUrl: './display-book.component.html',
})
export class DisplayBookComponent implements OnInit {
  book?: IBook | null;
  imageBlobUrl: String = '';

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
          this.imageBlobUrl = 'data:' + this.book?.imageContentType + ';base64,' + this.book?.image;
          this.titleService.setTitle('' + this.book?.title);
        })
      )
      .subscribe();
  }
}
