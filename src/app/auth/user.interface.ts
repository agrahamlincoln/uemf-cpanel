export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  register_date: Date;
  password: string;
  token: string;
  token_issue_date: Date;
  last_login: Date;
  enabled: boolean;
}
