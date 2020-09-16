import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { OrderedComponent } from './ordered.component';
import { OrderedDetailComponent } from './ordered-detail.component';
import { OrderedUpdateComponent } from './ordered-update.component';
import { OrderedDeleteDialogComponent } from './ordered-delete-dialog.component';
import { orderedRoute } from './ordered.route';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild(orderedRoute)],
  declarations: [OrderedComponent, OrderedDetailComponent, OrderedUpdateComponent, OrderedDeleteDialogComponent],
  entryComponents: [OrderedDeleteDialogComponent],
})
export class EBraireOrderedModule {}
