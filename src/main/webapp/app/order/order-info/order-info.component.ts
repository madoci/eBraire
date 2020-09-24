import { Component, OnInit } from '@angular/core';
import { Customer,ICustomer } from 'app/shared/model/customer.model';
import { Ordered } from 'app/shared/model/ordered.model';
import { OrderLine, IOrderLine } from 'app/shared/model/order-line.model';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { Status } from 'app/shared/model/enumerations/status.model';
import { CustomerService } from '../../entities/customer/customer.service';
import { OrderedService } from '../../entities/ordered/ordered.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IBook } from '../../shared/model/book.model';
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
      alert("Votre panier est vide vous ne pouvez pas passez de commande ajoutez des livres dans votre panier d'abord.");
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
    if (this.customer) {
      this.order.idCustomer = this.customer;
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
    this.customerService
      .update(this.customer!)
      .pipe(
        flatMap(result => {
          this.customer = result.body || this.customer;
          this.order.idCustomer = this.customer;
          return this.orderedService.create(this.order);
        }),
        flatMap(resultOrder => {
          this.order = resultOrder.body || this.order;
          return this.bookedBookService.orderFromCustomer(this.customer!.id!, this.order.id!,this.shoppingCartService.getItems());
        }),
        map(() => {
          this.shoppingCartService.clearCart();
          alert('Merci pour votre achat et a bientôt chez Ebraire !');
          this.router.navigateByUrl('');
        })
      )
      .subscribe();
  }

  debugTest(): void {
    this.customerService.find(3).subscribe(res => {
      if (res.body) {
        const customer = res.body;
        //alert(customer.customer!.login);
        customer.idOrders?.forEach(value => {
          alert(value.delevryAddress);
        });
      }
    });
    // this.orderedService.find(1101).subscribe(res => {
    //   if (res.body) {
    //     res.body.orderLines?.forEach(value => {
    //       alert(value.price);
    //     });
    //   }
    // });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.subscribe(
      () => alert('sucess'),
      () => alert('Fail')
    );
  }

  // constructor(public id?: number, public name?: string, public lastName?: string, public address?: string, public idOrders?: IOrdered[]) {}
  SendOrdered(): void {
    this.order.status = Status.ORDERED;
    const currentTime: moment.Moment = moment();
    this.order.commandStart = currentTime;
    this.customerService
      .update(this.customer!)
      .pipe(
        flatMap(result => {
          this.customer = result.body || this.customer;
          this.order.idCustomer = this.customer;
          return this.orderedService.create(this.order);
        }),
        flatMap(resultOrder => {
          this.order = resultOrder.body || this.order;
          return this.bookedBookService.orderFromCustomer(this.customer!.id!, this.order.id!,this.shoppingCartService.getItems());
        }),
        map(() => {
          this.shoppingCartService.clearCart();
          alert('Merci pour votre achat et a bientôt chez Ebraire !');
          this.router.navigateByUrl('');
        })
      )
      .subscribe();
  }

}
