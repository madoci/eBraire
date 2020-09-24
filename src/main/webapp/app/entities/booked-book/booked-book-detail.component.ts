import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookedBook } from 'app/shared/model/booked-book.model';

@Component({
  selector: 'jhi-booked-book-detail',
  templateUrl: './booked-book-detail.component.html',
})
export class BookedBookDetailComponent implements OnInit {
  bookedBook: IBookedBook | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedBook }) => (this.bookedBook = bookedBook));
  }

  previousState(): void {
    window.history.back();
  }
}
