export interface UserInfo {
  userId: string | number;
  userName: string;
  roles: string[];
  permissions: string[];
}

export type GlobalEnumType = Record<string, Record<string, string>[]>;
