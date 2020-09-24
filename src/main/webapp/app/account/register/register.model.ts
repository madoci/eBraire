import { ICustomer, Customer } from 'app/shared/model/customer.model';
import { IUser } from 'app/core/user/user.model';
import { IOrdered } from 'app/shared/model/ordered.model';

export interface IRegister extends ICustomer {
  password?: string;
}

export class Register implements IRegister {
  constructor(
    public id?: number,
    public addressLine?: string,
    public addressLine2?: string,
    public postcode?: string,
    public city?: string,
    public user?: IUser,
    public idOrders?: IOrdered[],
    public password?: string
  ) {}
}
