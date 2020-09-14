import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CatalogueModule } from '../catalogue/catalogue.module';
import { OrderSummaryModule } from 'app/order/order-summary/order-summary.module';
@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([HOME_ROUTE]), CatalogueModule, OrderSummaryModule],
  declarations: [HomeComponent],
})
export class EBraireHomeModule {}
