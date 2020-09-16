import { Route } from '@angular/router';

import { DisplayBookComponent } from './display-book.component';

export const DISPLAYBOOK_ROUTE: Route = {
  path: '',
  component: DisplayBookComponent,
  data: {
    authorities: [],
    pageTitle: 'display-book.title',
  },
};
