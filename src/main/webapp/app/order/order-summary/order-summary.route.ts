import { Route } from '@angular/router';
import { OrderSummaryComponent } from './order-summary.component';

export const ORDERSUMMARY_ROUTE: Route = {
  path: 'summary',
  component: OrderSummaryComponent,
  data: {
    authorities: [],
    pageTitle: 'pagetitle.ordersummary',
  },
};
