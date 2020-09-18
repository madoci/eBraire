import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';
import { CustomerService } from 'app/entities/customer/customer.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { map, flatMap } from 'rxjs/operators';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  account!: Account;
  customer!: ICustomer;
  success = false;
  languages = LANGUAGES;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined],
    address: [undefined],
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.accountService
      .identity()
      .pipe(
        map(account => {
          if (account) {
            this.settingsForm.patchValue({
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              langKey: account.langKey,
            });

            this.account = account;
          }
          return this.account.login;
        }),
        flatMap(login => {
          return this.customerService.findByLogin(login);
        }),
        map(customer => {
          if (customer.body) {
            this.customer = customer.body;
            this.settingsForm.patchValue({
              address: this.customer.address,
            });
          }
        })
      )
      .subscribe();
  }

  save(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;
    this.customer.address = this.settingsForm.get('address')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.languageService.getCurrentLanguage()) {
        this.languageService.changeLanguage(this.account.langKey);
      }
    });
    this.customerService.update(this.customer).subscribe();
  }
}
