import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderLine } from 'app/shared/model/order-line.model';
import { OrderLineService } from './order-line.service';
import { OrderLineDeleteDialogComponent } from './order-line-delete-dialog.component';

@Component({
  selector: 'jhi-order-line',
  templateUrl: './order-line.component.html',
})
export class OrderLineComponent implements OnInit, OnDestroy {
  orderLines?: IOrderLine[];
  eventSubscriber?: Subscription;

  constructor(protected orderLineService: OrderLineService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.orderLineService.query().subscribe((res: HttpResponse<IOrderLine[]>) => (this.orderLines = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOrderLines();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrderLine): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrderLines(): void {
    this.eventSubscriber = this.eventManager.subscribe('orderLineListModification', () => this.loadAll());
  }

  delete(orderLine: IOrderLine): void {
    const modalRef = this.modalService.open(OrderLineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderLine = orderLine;
  }
}
