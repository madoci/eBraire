import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderInfoComponent } from './order-info/order-info.component';
import { orderRoute } from './order.route';
import { RouterModule } from '@angular/router';
import { EBraireSharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [OrderInfoComponent],
  imports: [CommonModule, EBraireSharedModule, RouterModule.forChild(orderRoute)],
})
export class OrderModule {}
