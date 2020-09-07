import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IOrderLine, OrderLine } from 'app/shared/model/order-line.model';
import { OrderLineService } from './order-line.service';
import { IBook } from 'app/shared/model/book.model';
import { BookService } from 'app/entities/book/book.service';
import { IOrdered } from 'app/shared/model/ordered.model';
import { OrderedService } from 'app/entities/ordered/ordered.service';

type SelectableEntity = IBook | IOrdered;

@Component({
  selector: 'jhi-order-line-update',
  templateUrl: './order-line-update.component.html',
})
export class OrderLineUpdateComponent implements OnInit {
  isSaving = false;
  books: IBook[] = [];
  ordereds: IOrdered[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    price: [],
    orderLines: [],
    order: [],
  });

  constructor(
    protected orderLineService: OrderLineService,
    protected bookService: BookService,
    protected orderedService: OrderedService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderLine }) => {
      this.updateForm(orderLine);

      this.bookService.query().subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));

      this.orderedService.query().subscribe((res: HttpResponse<IOrdered[]>) => (this.ordereds = res.body || []));
    });
  }

  updateForm(orderLine: IOrderLine): void {
    this.editForm.patchValue({
      id: orderLine.id,
      quantity: orderLine.quantity,
      price: orderLine.price,
      orderLines: orderLine.orderLines,
      order: orderLine.order,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderLine = this.createFromForm();
    if (orderLine.id !== undefined) {
      this.subscribeToSaveResponse(this.orderLineService.update(orderLine));
    } else {
      this.subscribeToSaveResponse(this.orderLineService.create(orderLine));
    }
  }

  private createFromForm(): IOrderLine {
    return {
      ...new OrderLine(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      price: this.editForm.get(['price'])!.value,
      orderLines: this.editForm.get(['orderLines'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderLine>>): void {
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
