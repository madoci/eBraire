import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { BookService } from 'app/entities/book/book.service';
import { Book } from 'app/shared/model/book.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  bestSellers?: Book[];

  constructor(private accountService: AccountService, private loginModalService: LoginModalService, private bookService: BookService) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.bookService.query().subscribe(res => {
      this.bestSellers = res.body || [];
      if (this.bestSellers.length > 5) {
        this.bestSellers = this.bestSellers.slice(0, 5);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    const dec = Math.round((val - Math.floor(val)) * 100).toString();
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
