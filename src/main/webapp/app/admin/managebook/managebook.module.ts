import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EBraireSharedModule } from 'app/shared/shared.module';

import { ManagebookComponent } from './managebook.component';

import { managebookRoute } from './managebook.route';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild([managebookRoute])],
  declarations: [ManagebookComponent],
})
export class ManagebookModule {}
