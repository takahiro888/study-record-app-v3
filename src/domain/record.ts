export class Record {
  public id: number;
  public title: string;
  public time: number;
  public created_at: string | null;

  constructor(
    id: number,
    title: string,
    time: number,
    created_at: string | null,
  ) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.created_at = created_at;
  }
}
