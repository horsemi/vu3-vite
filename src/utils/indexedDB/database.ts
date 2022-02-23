import type { Table } from 'dexie';
import type { IColumnItem } from '/@/model/types';

import Dexie from 'dexie';

interface IEntityColumn {
  caption: string;
  columnList: IColumnItem[];
  key: string;
}

class database extends Dexie {
  private entityColumn: Table<IEntityColumn>;

  constructor() {
    super('ods-database');
    this.version(1).stores({
      entityColumn: '&caption, columnList, key', // Primary key and indexed props
    });
    this.entityColumn = this.table('entityColumn');
  }

  public putEntityColumn(entity: IEntityColumn) {
    return this.entityColumn.put(entity);
  }

  public readEntityColumn(caption: string) {
    return this.entityColumn.get(caption);
  }

  public clearEntityColumn() {
    return this.entityColumn.clear();
  }
}

const IndexedDBService = new database();

export default IndexedDBService;
