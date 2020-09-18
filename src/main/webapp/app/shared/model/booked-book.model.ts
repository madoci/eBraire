import { Moment } from 'moment';
import { ICustomer } from 'app/shared/model/customer.model';
import { IBook } from 'app/shared/model/book.model';

export interface IBookedBook {
  id?: number;
  expired?: number;
  quantity?: number;
  price?: number;
  customer?: ICustomer;
  book?: IBook;
}

export class BookedBook implements IBookedBook {
  constructor(
    public id?: number,
    public expired?: number,
    public quantity?: number,
    public price?: number,
    public customer?: ICustomer,
    public book?: IBook
  ) {}
}
