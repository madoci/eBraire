import { IUser } from 'app/core/user/user.model';
import { IOrdered } from 'app/shared/model/ordered.model';

export interface ICustomer {
  id?: number;
  address?: string;
  user?: IUser;
  idOrders?: IOrdered[];
}

export class Customer implements ICustomer {
  constructor(public id?: number, public address?: string, public user?: IUser, public idOrders?: IOrdered[]) {}
}
