import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IType } from 'app/shared/model/type.model';
import { TypeService } from './type.service';
import { TypeDeleteDialogComponent } from './type-delete-dialog.component';

@Component({
  selector: 'jhi-type',
  templateUrl: './type.component.html',
})
export class TypeComponent implements OnInit, OnDestroy {
  types?: IType[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected typeService: TypeService,
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
      this.typeService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));
      return;
    }

    this.typeService.query().subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('typeListModification', () => this.loadAll());
  }

  delete(type: IType): void {
    const modalRef = this.modalService.open(TypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.type = type;
  }
}
