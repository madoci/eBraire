import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrdered } from 'app/shared/model/ordered.model';

type EntityResponseType = HttpResponse<IOrdered>;
type EntityArrayResponseType = HttpResponse<IOrdered[]>;

@Injectable({ providedIn: 'root' })
export class OrderedService {
  public resourceUrl = SERVER_API_URL + 'api/ordereds';

  constructor(protected http: HttpClient) {}

  create(ordered: IOrdered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ordered);
    return this.http
      .post<IOrdered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ordered: IOrdered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ordered);
    return this.http
      .put<IOrdered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrdered>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrdered[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(ordered: IOrdered): IOrdered {
    const copy: IOrdered = Object.assign({}, ordered, {
      commandStart: ordered.commandStart && ordered.commandStart.isValid() ? ordered.commandStart.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.commandStart = res.body.commandStart ? moment(res.body.commandStart) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ordered: IOrdered) => {
        ordered.commandStart = ordered.commandStart ? moment(ordered.commandStart) : undefined;
      });
    }
    return res;
  }
}
