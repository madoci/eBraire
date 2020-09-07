import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IOrdered, Ordered } from 'app/shared/model/ordered.model';
import { OrderedService } from './ordered.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer/customer.service';

@Component({
  selector: 'jhi-ordered-update',
  templateUrl: './ordered-update.component.html',
})
export class OrderedUpdateComponent implements OnInit {
  isSaving = false;
  customers: ICustomer[] = [];
  commandStartDp: any;

  editForm = this.fb.group({
    id: [],
    commandStart: [],
    delevryAddress: [],
    billingAddress: [],
    status: [],
    idCustomer: [],
  });

  constructor(
    protected orderedService: OrderedService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordered }) => {
      this.updateForm(ordered);

      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));
    });
  }

  updateForm(ordered: IOrdered): void {
    this.editForm.patchValue({
      id: ordered.id,
      commandStart: ordered.commandStart,
      delevryAddress: ordered.delevryAddress,
      billingAddress: ordered.billingAddress,
      status: ordered.status,
      idCustomer: ordered.idCustomer,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ordered = this.createFromForm();
    if (ordered.id !== undefined) {
      this.subscribeToSaveResponse(this.orderedService.update(ordered));
    } else {
      this.subscribeToSaveResponse(this.orderedService.create(ordered));
    }
  }

  private createFromForm(): IOrdered {
    return {
      ...new Ordered(),
      id: this.editForm.get(['id'])!.value,
      commandStart: this.editForm.get(['commandStart'])!.value,
      delevryAddress: this.editForm.get(['delevryAddress'])!.value,
      billingAddress: this.editForm.get(['billingAddress'])!.value,
      status: this.editForm.get(['status'])!.value,
      idCustomer: this.editForm.get(['idCustomer'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrdered>>): void {
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

  trackById(index: number, item: ICustomer): any {
    return item.id;
  }
}
