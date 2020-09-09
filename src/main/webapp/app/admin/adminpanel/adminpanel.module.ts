import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EBraireSharedModule } from 'app/shared/shared.module';

import { AdminpanelComponent } from './adminpanel.component';

import { AdminpanelRoute } from './adminpanel.route';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([AdminpanelRoute])],
  declarations: [AdminpanelComponent],
})
export class AdminpanelModule {}
