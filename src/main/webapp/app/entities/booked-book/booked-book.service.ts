import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post<IBookedBook>(this.resourceUrl, bookedBook, { observe: 'response' });
  }

  update(bookedBook: IBookedBook): Observable<EntityResponseType> {
    return this.http.post<IBookedBook>(SERVER_API_URL + 'api/booked-books-update', bookedBook, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookedBook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookedBook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookedBook[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  order(id: number, idOrder: number): Observable<EntityResponseType> {
    return this.http.delete(SERVER_API_URL + 'api/order-booked-books/' + id + '/' + idOrder, { observe: 'response' });
  }

  deleteFromCustomer(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(SERVER_API_URL + 'api/booked-books-from-customer/' + id, { observe: 'response' });
  }
  orderFromCustomer(id: number, idOrder: number): Observable<EntityResponseType> {
    return this.http.delete(SERVER_API_URL + 'api/order-booked-books-from-customer/' + id + '/' + idOrder, { observe: 'response' });
  }
  publicCheckBookedBook(bookedBook: IBookedBook): Observable<HttpResponse<{}>> {
    return this.http.put<IBookedBook>(this.resourceUrl + '-check', bookedBook, { observe: 'response' });
  }
}
