import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalComponent } from 'app/shared/login/login.component';
import { JhiEventManager } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class LoginModalService {
  private isOpen = false;

  constructor(private modalService: NgbModal, protected eventManager: JhiEventManager) {}

  open(): void {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef: NgbModalRef = this.modalService.open(LoginModalComponent);
    modalRef.result.finally(() => {
      this.isOpen = false;
      this.eventManager.broadcast('CloseConnection');
    });
  }
}
