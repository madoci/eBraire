import { Route } from '@angular/router';

import { AdminpanelComponent } from './adminpanel.component';

export const AdminpanelRoute: Route = {
  path: '',
  component: AdminpanelComponent,
  data: {
    pageTitle: 'adminpanel.title',
  },
};
