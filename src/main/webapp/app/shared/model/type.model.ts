export interface IType {
  id?: number;
  type?: string;
}

export class Type implements IType {
  constructor(public id?: number, public type?: string) {}
}
