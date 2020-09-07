import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrdered } from 'app/shared/model/ordered.model';
import { OrderedService } from './ordered.service';

@Component({
  templateUrl: './ordered-delete-dialog.component.html',
})
export class OrderedDeleteDialogComponent {
  ordered?: IOrdered;

  constructor(protected orderedService: OrderedService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderedService.delete(id).subscribe(() => {
      this.eventManager.broadcast('orderedListModification');
      this.activeModal.close();
    });
  }
}
