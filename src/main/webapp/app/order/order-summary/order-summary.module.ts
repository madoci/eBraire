import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OrderSummaryComponent } from 'app/order/order-summary/order-summary.component';
import { OrderLineComponent } from 'app/order/order-summary/order-line/order-line.component';
import { EBraireDisplayBookModule } from 'app/display-book/display-book.module';
import { ORDERSUMMARY_ROUTE } from './order-summary.route';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderSummaryComponent, OrderLineComponent],
  imports: [CommonModule, FormsModule, EBraireDisplayBookModule, RouterModule.forChild([ORDERSUMMARY_ROUTE])],
})
export class OrderSummaryModule {}
