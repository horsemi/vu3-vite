export interface OdataQuery {
  $select: string;
  $expand: string;
  $count: string;
  $orderBy?: string;
  $filter?: string;
  $top?: number;
  $skip?: string | number;
}
