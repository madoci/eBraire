import { IBook } from 'app/shared/model/book.model';
import { IOrdered } from 'app/shared/model/ordered.model';

export interface IOrderLine {
  id?: number;
  quantity?: number;
  price?: number;
  book?: IBook;
  order?: IOrdered;
}

export class OrderLine implements IOrderLine {
  constructor(public id?: number, public quantity?: number, public price?: number, public book?: IBook, public order?: IOrdered) {}
}
