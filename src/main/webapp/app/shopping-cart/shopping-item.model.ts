import { IBook } from 'app/shared/model/book.model';

export class ShoppingItem {
  constructor(public book: IBook, public quantity: number) {}
}
