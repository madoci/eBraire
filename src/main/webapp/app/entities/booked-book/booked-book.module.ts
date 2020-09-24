import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { BookedBookComponent } from './booked-book.component';
import { BookedBookDetailComponent } from './booked-book-detail.component';
import { BookedBookUpdateComponent } from './booked-book-update.component';
import { BookedBookDeleteDialogComponent } from './booked-book-delete-dialog.component';
import { bookedBookRoute } from './booked-book.route';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild(bookedBookRoute)],
  declarations: [BookedBookComponent, BookedBookDetailComponent, BookedBookUpdateComponent, BookedBookDeleteDialogComponent],
  entryComponents: [BookedBookDeleteDialogComponent],
})
export class EBraireBookedBookModule {}
