export interface File {
  name: string;
  path: string;
  modified_date: Date;
  size: number;
  active: boolean;
  editing: boolean;
}
