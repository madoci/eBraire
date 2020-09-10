import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBook } from '../../shared/model/book.model';
import { BookService } from '../../entities/book/book.service';

@Component({
  selector: 'jhi-bookdialogdelete',
  templateUrl: './bookdialogdelete.component.html',
})
export class BookdialogdeleteComponent {
  book?: IBook;

  constructor(protected bookService: BookService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookService.delete(id).subscribe(() => {
      this.activeModal.close();
    });
  }
}
