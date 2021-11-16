export interface OdataQuery {
  $select: string;
  $expand: string;
  $count: string;
  $orderBy?: string;
  $filter?: string;
  $top?: string;
}
