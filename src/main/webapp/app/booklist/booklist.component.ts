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
  constructor(private bookService: BookService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentSearch = params['search'];
      const flag = this.currentSearch.includes('search-');
      this.currentSearch = this.currentSearch.substring(7);
      if (!flag || this.currentSearch === '') {
        this.bookService
          .query()
          .subscribe(
            (res: HttpResponse<IBook[]>) => ((this.books = res.body || new Book[0]()), (this.allBooks = res.body || new Book[0]()))
          );
      } else {
        this.bookService
          .searchByTitle(this.currentSearch.toString())
          .subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));
      }
    });
  }
}
