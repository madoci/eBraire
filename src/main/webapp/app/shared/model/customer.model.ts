import { IOrdered } from 'app/shared/model/ordered.model';
import { IUser } from 'app/core/user/user.model';

export interface ICustomer {
  id?: number;
  name?: string;
  lastName?: string;
  address?: string;
  idOrders?: IOrdered[];
  user?: IUser;
  password?: string;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public name?: string,
    public lastName?: string,
    public address?: string,
    public idOrders?: IOrdered[],
    public user?: IUser,
    public password?: string
  ) {}
}
