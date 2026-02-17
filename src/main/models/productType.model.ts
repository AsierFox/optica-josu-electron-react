export default class ProductTypeModel {
  id: number;
  type: string;

  constructor(row: any) {
    this.id = row.ID;
    this.type = row.TYPE;
  }
}
