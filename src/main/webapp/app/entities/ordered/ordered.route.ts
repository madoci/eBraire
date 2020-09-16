import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrdered, Ordered } from 'app/shared/model/ordered.model';
import { OrderedService } from './ordered.service';
import { OrderedComponent } from './ordered.component';
import { OrderedDetailComponent } from './ordered-detail.component';
import { OrderedUpdateComponent } from './ordered-update.component';

@Injectable({ providedIn: 'root' })
export class OrderedResolve implements Resolve<IOrdered> {
  constructor(private service: OrderedService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrdered> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((ordered: HttpResponse<Ordered>) => {
          if (ordered.body) {
            return of(ordered.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ordered());
  }
}

export const orderedRoute: Routes = [
  {
    path: '',
    component: OrderedComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.ordered.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderedDetailComponent,
    resolve: {
      ordered: OrderedResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.ordered.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderedUpdateComponent,
    resolve: {
      ordered: OrderedResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.ordered.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderedUpdateComponent,
    resolve: {
      ordered: OrderedResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.ordered.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
