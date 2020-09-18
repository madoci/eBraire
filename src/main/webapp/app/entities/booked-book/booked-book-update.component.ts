import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IBookedBook, BookedBook } from 'app/shared/model/booked-book.model';
import { BookedBookService } from './booked-book.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer/customer.service';
import { IBook } from 'app/shared/model/book.model';
import { BookService } from 'app/entities/book/book.service';

type SelectableEntity = ICustomer | IBook;

@Component({
  selector: 'jhi-booked-book-update',
  templateUrl: './booked-book-update.component.html',
})
export class BookedBookUpdateComponent implements OnInit {
  isSaving = false;
  customers: ICustomer[] = [];
  books: IBook[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    price: [],
    expired: [],
    customer: [],
    book: [],
  });

  constructor(
    protected bookedBookService: BookedBookService,
    protected customerService: CustomerService,
    protected bookService: BookService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedBook }) => {
      this.updateForm(bookedBook);

      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));

      this.bookService.query().subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));
    });
  }

  updateForm(bookedBook: IBookedBook): void {
    this.editForm.patchValue({
      id: bookedBook.id,
      quantity: bookedBook.quantity,
      price: bookedBook.price,
      expired: bookedBook.expired,
      customer: bookedBook.customer,
      book: bookedBook.book,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookedBook = this.createFromForm();
    if (bookedBook.id !== undefined) {
      this.subscribeToSaveResponse(this.bookedBookService.update(bookedBook));
    } else {
      this.subscribeToSaveResponse(this.bookedBookService.create(bookedBook));
    }
  }

  private createFromForm(): IBookedBook {
    return {
      ...new BookedBook(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      price: this.editForm.get(['price'])!.value,
      expired: this.editForm.get(['expired'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      book: this.editForm.get(['book'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookedBook>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
