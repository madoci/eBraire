import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EBraireSharedModule } from 'app/shared/shared.module';
import { GenreComponent } from './genre.component';
import { GenreDetailComponent } from './genre-detail.component';
import { GenreUpdateComponent } from './genre-update.component';
import { GenreDeleteDialogComponent } from './genre-delete-dialog.component';
import { genreRoute } from './genre.route';

@NgModule({
  imports: [EBraireSharedModule, RouterModule.forChild(genreRoute)],
  declarations: [GenreComponent, GenreDetailComponent, GenreUpdateComponent, GenreDeleteDialogComponent],
  entryComponents: [GenreDeleteDialogComponent],
})
export class EBraireGenreModule {}
