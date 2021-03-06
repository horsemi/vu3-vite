declare type TimeoutHandle = ReturnType<typeof setTimeout>;

declare type Nullable<T> = T | null;

declare type Recordable<T extends any = any> = Record<string, T>;

declare type Indexable<T extends any = any> = {
  [key: string]: T;
};
