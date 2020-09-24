import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.EBraireCustomerModule),
      },
      {
        path: 'ordered',
        loadChildren: () => import('./ordered/ordered.module').then(m => m.EBraireOrderedModule),
      },
      {
        path: 'order-line',
        loadChildren: () => import('./order-line/order-line.module').then(m => m.EBraireOrderLineModule),
      },
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then(m => m.EBraireBookModule),
      },
      {
        path: 'genre',
        loadChildren: () => import('./genre/genre.module').then(m => m.EBraireGenreModule),
      },
      {
        path: 'tag',
        loadChildren: () => import('./tag/tag.module').then(m => m.EBraireTagModule),
      },
      {
        path: 'type',
        loadChildren: () => import('./type/type.module').then(m => m.EBraireTypeModule),
      },
      {
        path: 'booked-book',
        loadChildren: () => import('./booked-book/booked-book.module').then(m => m.EBraireBookedBookModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EBraireEntityModule {}
