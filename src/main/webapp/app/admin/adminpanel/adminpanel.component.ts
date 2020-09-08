import { Component, OnInit } from '@angular/core';
import { IBook } from '../../shared/model/book.model';
import { BookService } from '../../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookdialogdeleteComponent } from '../bookdialogdelete/bookdialogdelete.component';

@Component({
  selector: 'jhi-adminpanel',
  templateUrl: './adminpanel.component.html',
})
export class AdminpanelComponent implements OnInit {
  books: IBook[] = [];
  constructor(protected modalService: NgbModal, private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.query().subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));
  }
  delete(book: IBook): void {
    const modalRef = this.modalService.open(BookdialogdeleteComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.book = book;
  }
}
