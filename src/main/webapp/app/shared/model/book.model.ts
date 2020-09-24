import { IType } from 'app/shared/model/type.model';
import { ITag } from 'app/shared/model/tag.model';
import { IGenre } from 'app/shared/model/genre.model';

export interface IBook {
  id?: number;
  title?: string;
  authors?: string;
  description?: string;
  unitPrice?: number;
  imageContentType?: string;
  image?: any;
  quantity?: number;
  type?: IType;
  tags?: ITag[];
  genres?: IGenre[];
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public title?: string,
    public authors?: string,
    public description?: string,
    public unitPrice?: number,
    public imageContentType?: string,
    public image?: any,
    public quantity?: number,
    public type?: IType,
    public tags?: ITag[],
    public genres?: IGenre[]
  ) {}
}
