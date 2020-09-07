import { IBook } from 'app/shared/model/book.model';

export interface ITag {
  id?: number;
  tag?: string;
  books?: IBook[];
}

export class Tag implements ITag {
  constructor(public id?: number, public tag?: string, public books?: IBook[]) {}
}
