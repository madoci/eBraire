import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBookedBook, BookedBook } from 'app/shared/model/booked-book.model';
import { BookedBookService } from './booked-book.service';
import { BookedBookComponent } from './booked-book.component';
import { BookedBookDetailComponent } from './booked-book-detail.component';
import { BookedBookUpdateComponent } from './booked-book-update.component';

@Injectable({ providedIn: 'root' })
export class BookedBookResolve implements Resolve<IBookedBook> {
  constructor(private service: BookedBookService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookedBook> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bookedBook: HttpResponse<BookedBook>) => {
          if (bookedBook.body) {
            return of(bookedBook.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BookedBook());
  }
}

export const bookedBookRoute: Routes = [
  {
    path: '',
    component: BookedBookComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.bookedBook.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookedBookDetailComponent,
    resolve: {
      bookedBook: BookedBookResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.bookedBook.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookedBookUpdateComponent,
    resolve: {
      bookedBook: BookedBookResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.bookedBook.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookedBookUpdateComponent,
    resolve: {
      bookedBook: BookedBookResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eBraireApp.bookedBook.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
