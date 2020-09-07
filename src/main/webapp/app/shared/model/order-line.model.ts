import { IBook } from 'app/shared/model/book.model';
import { IOrdered } from 'app/shared/model/ordered.model';

export interface IOrderLine {
  id?: number;
  quantity?: number;
  price?: number;
  orderLines?: IBook;
  order?: IOrdered;
}

export class OrderLine implements IOrderLine {
  constructor(public id?: number, public quantity?: number, public price?: number, public orderLines?: IBook, public order?: IOrdered) {}
}
