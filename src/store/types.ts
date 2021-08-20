export interface UserInfo {
  accountId: string;
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
