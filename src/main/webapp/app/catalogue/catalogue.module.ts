import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueComponent } from './catalogue.component';
import { RouterModule } from '@angular/router';
import { EBraireSharedModule } from 'app/shared/shared.module';
import { catalogueRoute } from './catalogue.route';
import { BooklistComponent } from '../booklist/booklist.component';
import { BooklistitemComponent } from '../booklist/booklistitem/booklistitem.component';
import { FilterComponent } from './filter/filter.component';
import { EBraireDisplayBookModule } from 'app/display-book/display-book.module';

@NgModule({
  declarations: [CatalogueComponent, BooklistComponent, BooklistitemComponent, FilterComponent],
  imports: [CommonModule, EBraireSharedModule, RouterModule.forChild(catalogueRoute), EBraireDisplayBookModule],
  exports: [BooklistComponent, BooklistitemComponent],
})
export class CatalogueModule {}
