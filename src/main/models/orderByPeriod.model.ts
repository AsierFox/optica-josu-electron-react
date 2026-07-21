export default class OrderByPeriodModel {
  period!: string;
  total!: number;

  constructor(row?: any) {
    this.period = row.PERIOD;
    this.total = row.TOTAL;
  }

}
