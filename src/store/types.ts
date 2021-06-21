export interface UserInfo {
  userId: string | number;
  userName: string;
  roles: string[];
  permissions: string[];
}

export type GlobalEnumType = {
  name: string;
  options: [{ key: string; value: string; description: string }];
};
