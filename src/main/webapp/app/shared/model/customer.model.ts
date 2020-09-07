import { IOrdered } from 'app/shared/model/ordered.model';

export interface ICustomer {
  id?: number;
  name?: string;
  lastName?: string;
  address?: string;
  idOrders?: IOrdered[];
}

export class Customer implements ICustomer {
  constructor(public id?: number, public name?: string, public lastName?: string, public address?: string, public idOrders?: IOrdered[]) {}
}
