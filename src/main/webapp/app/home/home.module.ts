import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CatalogueModule } from '../catalogue/catalogue.module';
import { OrderModule } from '../order/order.module';
import { EBraireDisplayBookModule } from 'app/display-book/display-book.module';
@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([HOME_ROUTE]), CatalogueModule, OrderModule, EBraireDisplayBookModule],
  declarations: [HomeComponent],
})
export class EBraireHomeModule {}
