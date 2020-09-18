import { IUser } from 'app/core/user/user.model';
import { IOrdered } from 'app/shared/model/ordered.model';

export interface ICustomer {
  id?: number;
  addressLine?: string;
  addressLine2?: string;
  postcode?: string;
  city?: string;
  user?: IUser;
  idOrders?: IOrdered[];
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public addressLine?: string,
    public addressLine2?: string,
    public postcode?: string,
    public city?: string,
    public user?: IUser,
    public idOrders?: IOrdered[]
  ) {}
}
