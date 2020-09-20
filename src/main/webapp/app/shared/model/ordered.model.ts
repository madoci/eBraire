import { Moment } from 'moment';
import { IOrderLine } from 'app/shared/model/order-line.model';
import { ICustomer } from 'app/shared/model/customer.model';
import { Status } from 'app/shared/model/enumerations/status.model';

export interface IOrdered {
  id?: number;
  commandStart?: Moment;
  delevryAddress?: string;
  billingAddress?: string;
  status?: Status;
  orderLines?: IOrderLine[];
  idCustomer?: ICustomer;
}

export class Ordered implements IOrdered {
  constructor(
    public id?: number,
    public commandStart?: Moment,
    public delevryAddress?: string,
    public billingAddress?: string,
    public status?: Status,
    public orderLines?: IOrderLine[],
    public idCustomer?: ICustomer
  ) {}
}
