import BaseModel from "./base.model";

export default class ProductTypeModel extends BaseModel {
  id!: number;
  type!: string;

  constructor(row?: any) {
    super();

    if (!row) {
      return;
    }

    this.id = row.ID;
    this.type = row.TYPE;
  }
}
