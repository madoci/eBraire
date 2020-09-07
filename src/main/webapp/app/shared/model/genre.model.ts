import { IBook } from 'app/shared/model/book.model';

export interface IGenre {
  id?: number;
  genre?: string;
  books?: IBook[];
}

export class Genre implements IGenre {
  constructor(public id?: number, public genre?: string, public books?: IBook[]) {}
}
