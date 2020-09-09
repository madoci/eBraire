import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { BooklistComponent } from '../booklist/booklist.component';
import { BooklistitemComponent } from '../booklist/booklistitem/booklistitem.component';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, BooklistComponent, BooklistitemComponent],
})
export class EBraireHomeModule {}
