import { IType } from 'app/shared/model/type.model';
import { ITag } from 'app/shared/model/tag.model';
import { IGenre } from 'app/shared/model/genre.model';

export interface IBook {
  id?: number;
  title?: string;
  authors?: string;
  descriptionContentType?: string;
  description?: any;
  unitPrice?: number;
  totalPrice?: number;
  imageContentType?: string;
  image?: any;
  type?: IType;
  tags?: ITag[];
  genres?: IGenre[];
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public title?: string,
    public authors?: string,
    public descriptionContentType?: string,
    public description?: any,
    public unitPrice?: number,
    public totalPrice?: number,
    public imageContentType?: string,
    public image?: any,
    public type?: IType,
    public tags?: ITag[],
    public genres?: IGenre[]
  ) {}
}
