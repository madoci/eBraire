import { IBook, Book } from './../../shared/model/book.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-managebook',
  templateUrl: './managebook.component.html',
})
export class ManagebookComponent implements OnInit {
  id?: string | null;
  book?: IBook | null;
  isSaving = false;
  newBook = true;

  // Nouvelles variables contenant certains champs convertis du livre
  desc?: string | null = '';

  constructor(private route: ActivatedRoute, protected bookService: BookService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params) {
        this.id = params.get('id');
      }
      this.bookService.find(+(this.id || '-1')).subscribe(book => {
        if (book.body) {
          this.newBook = false;
        }
        this.book = book.body;
        const tempBook = this.book || new Book();
        this.desc = tempBook.description;
      });
      this.book = this.book || new Book();
      // const reader = new FileReader();
      // reader.readAsArrayBuffer(this.book.description);
    });
  }

  save(): void {
    this.isSaving = true;
    if (this.newBook) {
      this.subscribeToSaveResponse(this.bookService.create(this.book || new Book()));
    } else {
      this.subscribeToSaveResponse(this.bookService.update(this.book || new Book()));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  previousState(): void {
    window.history.back();
  }
}
