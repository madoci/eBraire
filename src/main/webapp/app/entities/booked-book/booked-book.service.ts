import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
// import { Ordered } from 'app/shared/model/ordered.model';
// import { OrderLine } from 'app/shared/model/order-line.model';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IBookedBook } from 'app/shared/model/booked-book.model';

type EntityResponseType = HttpResponse<IBookedBook>;
type EntityArrayResponseType = HttpResponse<IBookedBook[]>;

@Injectable({ providedIn: 'root' })
export class BookedBookService {
  public resourceUrl = SERVER_API_URL + 'api/booked-books';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/booked-books';

  constructor(protected http: HttpClient) {}

  create(bookedBook: IBookedBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookedBook);
    return this.http
      .post<IBookedBook>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bookedBook: IBookedBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookedBook);
    return this.http
      .put<IBookedBook>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBookedBook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBookedBook[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  deleteFromCustomer(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(SERVER_API_URL + 'api/booked-books-from-customer/' + id, { observe: 'response' });
  }
  orderFromCustomer(id: number, idOrder: number): Observable<EntityResponseType> {
    return this.http.delete(SERVER_API_URL + 'api/order-booked-books-from-customer/' + id + '/' + idOrder, { observe: 'response' });
  }
  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBookedBook[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  publicCheckBookedBook(bookedBook: IBookedBook): Observable<HttpResponse<{}>> {
    const copy = this.convertDateFromClient(bookedBook);
    return this.http
      .put<IBookedBook>(this.resourceUrl + '-check', copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(bookedBook: IBookedBook): IBookedBook {
    const copy: IBookedBook = Object.assign({}, bookedBook, {
      expired: 0,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.expired = 0;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bookedBook: IBookedBook) => {
        bookedBook.expired = 0;
      });
    }
    return res;
  }
}
