import { Component, OnInit } from '@angular/core';
import { ICustomer } from 'app/shared/model/customer.model';
import { Ordered } from 'app/shared/model/ordered.model';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { Status } from 'app/shared/model/enumerations/status.model';
import { CustomerService } from '../../entities/customer/customer.service';
import { OrderedService } from '../../entities/ordered/ordered.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BookedBookService } from '../../entities/booked-book/booked-book.service';
import { flatMap, map } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'jhi-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
})
export class OrderInfoComponent implements OnInit {
  customer?: ICustomer;
  displayPayment: Boolean = true;
  order: Ordered = new Ordered();
  loading: Boolean = true;
  error: String = '';
  doNotMatch = false;

  customerForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    confirmEmail: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    addressLine: ['', [Validators.required]],
    addressLine2: ['', []],
    postcode: ['', [Validators.required, Validators.pattern('[0-9]{5}$')]],
    city: ['', [Validators.required]],
  });
  billingForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    addressLine: ['', [Validators.required]],
    addressLine2: ['', []],
    postcode: ['', [Validators.required, Validators.pattern('[0-9]{5}$')]],
    city: ['', [Validators.required]],
    cardNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
  });

  constructor(
    private shoppingCartService: ShoppingCartService,
    private bookedBookService: BookedBookService,
    private orderedService: OrderedService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.shoppingCartService.getItems().length === 0) {
      alert('Votre panier est vide. Veuillez ajouter des livres avant de passer commande.');
      this.router.navigateByUrl('');
    }

    this.accountService
      .identity()
      .pipe(
        map(account => {
          if (account) {
            this.customerForm.patchValue({
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              confirmEmail: account.email,
            });

            return account.login;
          }
          return '';
        }),
        flatMap(login => {
          return this.customerService.findByLogin(login);
        }),
        map(customer => {
          if (customer.body) {
            this.customer = customer.body;

            this.customerForm.patchValue({
              addressLine: this.customer.addressLine,
              addressLine2: this.customer.addressLine2,
              postcode: this.customer.postcode,
              city: this.customer.city,
            });
          }
        })
      )
      .subscribe();

    this.goToInfo();
    this.loading = false;
  }

  getTotalPrice(): number {
    let price = 0;
    this.shoppingCartService.items.forEach(element => {
      price = price + element.book!.unitPrice! * element.quantity!;
    });
    return price;
  }
  public goToPayment(): void {
    this.doNotMatch = this.customerForm.get(['email'])!.value !== this.customerForm.get(['confirmEmail'])!.value;

    if (!this.doNotMatch) {
      document.getElementById('CustomerInfo')!.style.display = 'none';
      document.getElementById('Payment')!.style.display = 'block';

      this.billingForm.patchValue({
        firstName: this.customerForm.get(['firstName'])!.value,
        lastName: this.customerForm.get(['lastName'])!.value,
        addressLine: this.customerForm.get(['addressLine'])!.value,
        addressLine2: this.customerForm.get(['addressLine2'])!.value,
        postcode: this.customerForm.get(['postcode'])!.value,
        city: this.customerForm.get(['city'])!.value,
      });
    }
  }

  public goToInfo(): void {
    document.getElementById('CustomerInfo')!.style.display = 'block';
    document.getElementById('Payment')!.style.display = 'none';
  }

  public pay(): void {
    let idResuest = -1;
    if (this.customer) {
      this.order.idCustomer = this.customer;
      idResuest = this.customer.id!;
    }

    this.order.delevryAddress = this.customerForm.get(['lastName'])!.value + ' ' + this.customerForm.get(['firstName'])!.value + '\n';
    this.order.delevryAddress += this.customerForm.get(['addressLine'])!.value + '\n';
    this.order.delevryAddress += this.customerForm.get(['addressLine2'])!.value
      ? this.customerForm.get(['addressLine2'])!.value + '\n'
      : '';
    this.order.delevryAddress += this.customerForm.get(['postcode'])!.value + ' ' + this.customerForm.get(['city'])!.value;

    this.order.billingAddress = this.billingForm.get(['lastName'])!.value + ' ' + this.billingForm.get(['firstName'])!.value + '\n';
    this.order.billingAddress += this.billingForm.get(['addressLine'])!.value + '\n';
    this.order.billingAddress += this.billingForm.get(['addressLine2'])!.value ? this.billingForm.get(['addressLine2'])!.value + '\n' : '';
    this.order.billingAddress += this.billingForm.get(['postcode'])!.value + ' ' + this.billingForm.get(['city'])!.value;

    this.order.status = Status.ORDERED;

    this.order.commandStart = moment();
    this.orderedService
      .create(this.order)
      .pipe(
        flatMap(resultOrder => {
          this.order = resultOrder.body || this.order;
          return this.bookedBookService.orderFromCustomer(idResuest, this.order.id!, this.shoppingCartService.getItems());
        }),
        map(element => {
          if (element.body !== null) {
            this.shoppingCartService.clearCart();
            alert("Merci pour votre achat et à bientôt chez l'ebraire !");
            this.router.navigateByUrl('');
          } else {
            alert('Délai dépassé pour le paiement.');
            this.router.navigateByUrl('');
          }
        })
      )
      .subscribe();
  }
}
