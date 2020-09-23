import { Component, OnInit } from '@angular/core';
import { Customer } from 'app/shared/model/customer.model';
import { Ordered } from 'app/shared/model/ordered.model';
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
import { flatMap, map, toArray } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
})
export class OrderInfoComponent implements OnInit {
  customer?: Customer;
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

    this.orderedService
      .create(this.order)
      .pipe(
        flatMap(resultOrder => {
          this.order = resultOrder.body || this.order;
          return this.shoppingCartService.getItems();
        }),
        map(item => {
          if (item.id) {
            this.bookedBookService.order(item.id, this.order.id!);
          }
          return item;
        }),
        toArray(),
        map(() => {
          if (this.customer) {
            if (!this.customer.idOrders) {
              this.customer.idOrders = [];
            }
            this.customer.idOrders.push(this.order);
            this.customerService.update(this.customer);
          }

          this.shoppingCartService.clearCart();
          alert("Merci pour votre achat et à bientôt chez l'eBraire !");
          this.router.navigateByUrl('');
        })
      )
      .subscribe();

    // this.orderedService.create(this.order).pipe(
    //   flatMap(orderResponse => {
    //     this.order = orderResponse.body!;
    //     this.shoppingCartService.getItems().forEach(item => {
    //       const orderLine: IOrderLine = new OrderLine();
    //       orderLine.price = item.book.unitPrice! * item.quantity;
    //       orderLine.quantity = item.quantity;
    //       orderLine.book = item.book;
    //       orderLine.order = this.order;
    //       return this.orderLineService.create(orderLine);
    //     });
    //   }),
    //   map(orderLineResponse => {
    //     if (!this.order.orderLines) {
    //       this.order.orderLines = [];
    //     }
    //   }),
    // ).subscribe();

    // this.orderedService.create(this.order).subscribe(orderResponse => {
    //   if (orderResponse.body) {
    //     this.order = orderResponse.body;
    //     this.order.orderLines = [];
    //     this.shoppingCartService.getItems().forEach(item => {
    //       const orderLine: IOrderLine = new OrderLine();
    //       orderLine.price = item.book.unitPrice! * item.quantity;
    //       orderLine.quantity = item.quantity;
    //       orderLine.book = item.book;
    //       orderLine.order = this.order;
    //       // let i = 0;
    //       this.orderLineService.create(orderLine).subscribe(orderLineResponse => {
    //         if (orderLineResponse.body) {
    //           this.order.orderLines!.push(orderLineResponse.body);
    //         }
    //         // i = i + 1;
    //         // alert(i);
    //         if (this.order.orderLines?.length === this.shoppingCartService.getItems().length) {
    //           alert('End');
    //           this.orderedService.update(this.order).subscribe(res => {
    //             alert(res.body?.delevryAddress);
    //             if (!this.customer?.idOrders) {
    //               this.customer!.idOrders = [];
    //             }
    //             this.customer?.idOrders.push(res.body!);
    //             this.customerService.update(this.customer!).subscribe(cus => {
    //               alert(cus.body?.id);
    //             });
    //           });
    //         }
    //       });
    //     });
    //   }
    // });

    // this.order.orderLines = [];
    // this.shoppingCartService.getItems().forEach(item => {
    //   const orderLine: IOrderLine = new OrderLine();
    //   orderLine.price = item.book.unitPrice! * item.quantity;
    //   orderLine.quantity = item.quantity;
    //   orderLine.book = item.book;
    //   orderLine.order = this.order;
    //   //alert(orderLine.price);
    //   //this.order.orderLines!.push(orderLine);
    //   let i = 0;
    //   this.orderLineService.create(orderLine).subscribe(res => {
    //     if (res.body) {
    //       this.order.orderLines!.push(res.body);
    //     }
    //     i = i + 1;
    //     if (i === this.shoppingCartService.getItems().length) {
    //       this.orderedService.create(this.order).subscribe(res2 => {
    //         alert(res2.body?.delevryAddress);
    //       });
    //     }
    //   });
    // });
    // this.orderedService.create(this.order).subscribe(res => {
    //   alert(res.body?.delevryAddress);
    // });

    // this.orderedService.create(this.order).subscribe(result => {
    //   if (result.body) {
    //     this.order = result.body;
    //     this.order.orderLines = new Array(0);
    //     this.shoppingCartService.getItems().forEach(item => {
    //       const orderLine: IOrderLine = new OrderLine();
    //       orderLine.price = item.book.unitPrice! * item.quantity;
    //       orderLine.quantity = item.quantity;
    //       orderLine.book = item.book;
    //       orderLine.order = this.order;
    //       let i = 0;
    //       this.orderLineService.create(orderLine).subscribe(response => {
    //         if (response.body) {
    //           this.order.orderLines!.push(response.body);
    //         }
    //         i = i + 1;
    //         if (i === this.shoppingCartService.getItems().length) {
    //           this.orderedService.update(this.order);
    //         }
    //       });
    //     });
    //     if (this.customer) {
    //       if (!this.customer.idOrders) {
    //         this.customer.idOrders = new Array(0);
    //       }
    //       this.customer.idOrders.push(this.order);
    //       this.customerService.update(this.customer).subscribe();
    //     }
    //   }
    // });

    // alert(this.order.delevryAddress);
  }

  debugTest(): void {
    this.customerService.find(3).subscribe(res => {
      if (res.body) {
        const customer = res.body;
        alert(customer.user!.login);
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

  // SendOrdered(): void {
  //   this.user.address = this.order.billingAddress;
  //   this.order.status = Status.ORDERED;
  //   const currentTime: moment.Moment = moment();
  //   this.order.commandStart = currentTime;
  //   this.customerService
  //     .update(this.user)
  //     .pipe(
  //       flatMap(result => {
  //         this.user = result.body || this.user;
  //         this.order.idCustomer = this.user;
  //         return this.orderedService.create(this.order);
  //       }),
  //       flatMap(resultOrder => {
  //         this.order = resultOrder.body || this.order;
  //         return this.bookedBookService.orderFromCustomer(this.user.id!, this.order.id!);
  //       }),
  //       map(() => {
  //         this.shoppingCartService.clearCart();
  //         alert('Merci pour votre achat et à bientôt chez l\'eBraire !');
  //         this.router.navigateByUrl('');
  //       })
  //     )
  //     .subscribe();
  // }
}
