import { Route } from '@angular/router';

import { ManagebookComponent } from './managebook.component';

export const managebookRoute: Route = {
  path: '',
  component: ManagebookComponent,
  data: {
    pageTitle: 'managebook.title',
  },
};
