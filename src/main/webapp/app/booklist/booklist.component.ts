import { Component, OnInit } from '@angular/core';
import { IBook, Book } from '../shared/model/book.model';
import { BookService } from '../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'jhi-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = [];
  currentSearch: String = '';
  types: String = '';
  genres: String = '';
  tags: String = '';
  constructor(private bookService: BookService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentSearch = params['search'];
      this.types = params['types'];
      this.genres = params['genres'];
      this.tags = params['tags'];
      this.bookService
        .searchByFilterAndTitle(this.currentSearch.toString(), this.types.toString(), this.genres.toString(), this.tags.toString())
        .subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));
    });
  }
}
