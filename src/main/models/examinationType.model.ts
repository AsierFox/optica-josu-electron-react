export default class ExaminationTypeModel {
  id: number;
  type: string;

  constructor(row: any) {
    this.id = row.ID;
    this.type = row.TYPE;
  }
}
