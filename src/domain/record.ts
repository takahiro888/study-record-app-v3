export class Record {
  public id: number;
  public title: string;
  public time: number;

  constructor(id: number, title: string, time: number) {
    this.id = id;
    this.title = title;
    this.time = time;
  }
}
