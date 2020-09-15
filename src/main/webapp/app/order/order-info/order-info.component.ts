import { Component, OnInit } from '@angular/core';
import { Customer } from 'app/shared/model/customer.model';
import { Ordered } from 'app/shared/model/ordered.model';
import { OrderLine } from 'app/shared/model/order-line.model';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { Status } from 'app/shared/model/enumerations/status.model';
import { OrderLineService } from '../../entities/order-line/order-line.service';
import { IOrderLine } from '../../shared/model/order-line.model';
import { CustomerService } from '../../entities/customer/customer.service';
import { OrderedService } from '../../entities/ordered/ordered.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IBook } from '../../shared/model/book.model';
import * as moment from 'moment';
import { flatMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'jhi-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
})
export class OrderInfoComponent implements OnInit {
  user: Customer = new Customer();
  displayPayment: Boolean = true;
  email: String = '';
  order: Ordered = new Ordered();
  loading: Boolean = true;
  error: String = '';
  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderLineService: OrderLineService,
    private customerService: CustomerService,
    private orderedService: OrderedService,
    private router: Router
  ) {}
  // public quantity?: number, public price?: number, public orderLines?: IBook, public order?: IOrdered
  ngOnInit(): void {
    if (this.shoppingCartService.getItems().length === 0) {
      alert("Votre panier est vide vous ne pouvez pas passez de commande ajoutez des livres dans votre panier d'abord.");
      this.router.navigateByUrl('');
    }
    this.next(false);
    this.loading = false;
  }

  public next(isPayment: Boolean): void {
    const emailElement: HTMLElement | null = document.getElementById('email');
    const emailverifElement: HTMLElement | null = document.getElementById('emailverif');
    if (!this.loading) {
      if (
        this.user.name === '' ||
        this.user.lastName === '' ||
        this.order.delevryAddress === '' ||
        this.user.name === undefined ||
        this.order.delevryAddress === undefined ||
        this.user.lastName === undefined
      ) {
        this.error = 'champ non rempli';
        return;
      }
      if (!(emailElement === null) || !(emailverifElement === null) || this.email === '') {
        this.error = 'adresse email ivalide';
        return;
      }
    }
    this.displayPayment = isPayment;
    // Declare all variables
    let name: string;
    let notdisplayName: string;
    if (this.displayPayment) {
      name = 'Payment';
      this.order.billingAddress = this.order.delevryAddress;
      notdisplayName = 'CustomerInfo';
      const previousElement: HTMLElement | null = document.getElementById('Previous');
      const validateElement: HTMLElement | null = document.getElementById('Validate');
      const paidElement: HTMLElement | null = document.getElementById('Paid');
      if (previousElement) {
        previousElement.style.display = 'block';
      }
      if (validateElement) {
        validateElement.style.display = 'none';
      }
      if (paidElement) {
        paidElement.style.display = 'block';
      }
    } else {
      name = 'CustomerInfo';
      notdisplayName = 'Payment';
      const previousElement: HTMLElement | null = document.getElementById('Previous');
      const validateElement: HTMLElement | null = document.getElementById('Validate');
      const paidElement: HTMLElement | null = document.getElementById('Paid');
      if (previousElement) {
        previousElement.style.display = 'none';
      }
      if (validateElement) {
        validateElement.style.display = 'block';
      }
      if (paidElement) {
        paidElement.style.display = 'none';
      }
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    const notDiplayedElement: HTMLElement | null = document.getElementById(name);
    if (notDiplayedElement) {
      notDiplayedElement.style.display = 'block';
    }
    const diplayedElement: HTMLElement | null = document.getElementById(notdisplayName);
    if (diplayedElement) {
      diplayedElement.style.display = 'none';
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.subscribe(
      () => alert('sucess'),
      () => alert('Fail')
    );
  }
  // constructor(public id?: number, public name?: string, public lastName?: string, public address?: string, public idOrders?: IOrdered[]) {}
  SendOrdered(): void {
    this.user.address = this.order.billingAddress;
    this.order.status = Status.ORDERED;
    const currentTime: moment.Moment = moment();
    this.order.commandStart = currentTime;
    this.customerService
      .create(this.user)
      .pipe(
        flatMap(result => {
          this.user = result.body || this.user;
          this.order.idCustomer = this.user;
          return this.orderedService.create(this.order);
        }),
        map(resultOrder => {
          this.order = resultOrder.body || this.order;
          if (!this.user.idOrders) {
            this.user.idOrders = new Array(0);
          }
          this.user.idOrders.push(this.order);
          this.customerService.update(this.user);
          this.order.oderedBooks = new Array(0);
          let i = 0;
          this.shoppingCartService.getItems().forEach(Item => {
            const currentOrderLine: IOrderLine = new OrderLine();
            currentOrderLine.price = Item.book.unitPrice! * Item.quantity;
            currentOrderLine.quantity = Item.quantity;
            currentOrderLine.orderLines = Item.book;
            currentOrderLine.order = this.order;
            this.orderLineService.create(currentOrderLine).subscribe(Response => {
              const orderLine = Response.body;
              if (orderLine) {
                this.order.oderedBooks!.push(orderLine);
              }
              i = i + 1;
              if (i === this.shoppingCartService.getItems().length) {
                this.orderedService.update(this.order);
              }
            });
          });
          this.shoppingCartService.clearCart();
          alert('Merci pour votre achat et a bientôt chez Ebraire !');
          this.router.navigateByUrl('');
        })
      )
      .subscribe();
  }
}
