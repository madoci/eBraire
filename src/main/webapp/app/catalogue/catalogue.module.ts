import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueComponent } from './catalogue.component';
import { RouterModule } from '@angular/router';
import { EBraireSharedModule } from 'app/shared/shared.module';
import { catalogueRoute } from './catalogue.route';
import { BooklistComponent } from '../booklist/booklist.component';
import { BooklistitemComponent } from '../booklist/booklistitem/booklistitem.component';

@NgModule({
  declarations: [CatalogueComponent, BooklistComponent, BooklistitemComponent],
  imports: [CommonModule, EBraireSharedModule, RouterModule.forChild(catalogueRoute)],
  exports: [BooklistComponent, BooklistitemComponent],
})
export class CatalogueModule {}
