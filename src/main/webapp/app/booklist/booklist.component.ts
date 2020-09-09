import { Component, OnInit } from '@angular/core';
import { IBook, Book } from '../shared/model/book.model';
import { BookService } from '../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  books: Book[] = [];
  temp: String = 'Salut';
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService
      .query()
      .subscribe((res: HttpResponse<IBook[]>) => ((this.books = res.body || new Book[0]()), (this.temp = this.books.length.toString())));
  }
}
