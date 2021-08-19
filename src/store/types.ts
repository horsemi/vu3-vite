export interface UserInfo {
  accountId: string | number;
  accountName: string;
  applicationId: string;
  userName: string;
  roles?: string[];
  permissions: string[];
}

export type GlobalEnumType = {
  name: string;
  options: [{ key: string; value: string; description: string }];
};
