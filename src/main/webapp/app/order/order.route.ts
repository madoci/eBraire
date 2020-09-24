import { Routes } from '@angular/router';

import { OrderInfoComponent } from './order-info/order-info.component';

export const orderRoute: Routes = [
  {
    path: 'order',
    component: OrderInfoComponent,
    data: {
      pageTitle: 'pagetitle.orderinfo',
    },
  },
  {
    path: 'summary',
    loadChildren: () => import('./order-summary/order-summary.module').then(m => m.OrderSummaryModule),
  },
];
