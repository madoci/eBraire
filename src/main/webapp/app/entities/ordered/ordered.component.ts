import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrdered } from 'app/shared/model/ordered.model';
import { OrderedService } from './ordered.service';
import { OrderedDeleteDialogComponent } from './ordered-delete-dialog.component';

@Component({
  selector: 'jhi-ordered',
  templateUrl: './ordered.component.html',
})
export class OrderedComponent implements OnInit, OnDestroy {
  ordereds?: IOrdered[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected orderedService: OrderedService,
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
      this.orderedService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IOrdered[]>) => (this.ordereds = res.body || []));
      return;
    }

    this.orderedService.query().subscribe((res: HttpResponse<IOrdered[]>) => (this.ordereds = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOrdereds();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrdered): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrdereds(): void {
    this.eventSubscriber = this.eventManager.subscribe('orderedListModification', () => this.loadAll());
  }

  delete(ordered: IOrdered): void {
    const modalRef = this.modalService.open(OrderedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ordered = ordered;
  }
}
