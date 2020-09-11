import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { DISPLAYBOOK_ROUTE } from './display-book.route';
import { DisplayBookComponent } from './display-book.component';
import { BookDetailsComponent } from './book-details/book-details.component';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([DISPLAYBOOK_ROUTE])],
  declarations: [DisplayBookComponent, BookDetailsComponent],
})
export class EBraireDisplayBookModule {}
