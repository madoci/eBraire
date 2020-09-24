import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookedBook } from 'app/shared/model/booked-book.model';
import { BookedBookService } from './booked-book.service';
import { BookedBookDeleteDialogComponent } from './booked-book-delete-dialog.component';

@Component({
  selector: 'jhi-booked-book',
  templateUrl: './booked-book.component.html',
})
export class BookedBookComponent implements OnInit, OnDestroy {
  bookedBooks?: IBookedBook[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected bookedBookService: BookedBookService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.bookedBookService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IBookedBook[]>) => (this.bookedBooks = res.body || []));
      return;
    }

    this.bookedBookService.query().subscribe((res: HttpResponse<IBookedBook[]>) => (this.bookedBooks = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInBookedBooks();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IBookedBook): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBookedBooks(): void {
    this.eventSubscriber = this.eventManager.subscribe('bookedBookListModification', () => this.loadAll());
  }

  delete(bookedBook: IBookedBook): void {
    const modalRef = this.modalService.open(BookedBookDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bookedBook = bookedBook;
  }
}
