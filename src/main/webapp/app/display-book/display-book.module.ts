import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { DISPLAYBOOK_ROUTE } from './display-book.route';
import { DisplayBookComponent } from './display-book.component';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([DISPLAYBOOK_ROUTE])],
  declarations: [DisplayBookComponent],
})
export class EBraireDisplayBookModule {}
