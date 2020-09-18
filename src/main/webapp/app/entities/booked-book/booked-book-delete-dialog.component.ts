import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBookedBook } from 'app/shared/model/booked-book.model';
import { BookedBookService } from './booked-book.service';

@Component({
  templateUrl: './booked-book-delete-dialog.component.html',
})
export class BookedBookDeleteDialogComponent {
  bookedBook?: IBookedBook;

  constructor(
    protected bookedBookService: BookedBookService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookedBookService.delete(id).subscribe(() => {
      this.eventManager.broadcast('bookedBookListModification');
      this.activeModal.close();
    });
  }
}
