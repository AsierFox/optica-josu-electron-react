import BaseModel from "./base.model";

export default class ExaminationTypeModel extends BaseModel {
  id: number;
  type: string;

  constructor(row: any) {
    super();

    this.id = row.ID;
    this.type = row.TYPE;
  }
}
