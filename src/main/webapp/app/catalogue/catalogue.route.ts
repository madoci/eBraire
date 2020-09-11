import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue.component';

export const catalogueRoute: Routes = [
  {
    path: 'catalogue/:search',
    component: CatalogueComponent,
  },
];
