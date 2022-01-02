class IndexedDB {
  private db;

  openConnect(success?: () => void, fail?: () => void) {
    const databaseName = 'ods';
    const version = 1;

    const tableList = [
      {
        name: 'entityColumn',
        key: 'caption',
      },
    ];

    // indexedDB.open()方法返回一个 IDBRequest 对象。这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果。
    const request = window.indexedDB.open(databaseName, version);

    // error事件表示打开数据库失败。
    request.onerror = () => {
      console.error('IndexedDB数据库打开报错');
      fail && fail();
    };

    // success事件表示成功打开数据库。
    // 这时，通过request对象的result属性拿到数据库对象。
    request.onsuccess = () => {
      this.db = request.result;
      success && success();
    };

    // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded。
    // 这时通过事件对象的target.result属性，拿到数据库实例。
    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      let objectStore;
      tableList.forEach((item) => {
        const { name, key } = item;
        if (!this.db.objectStoreNames.contains(name)) {
          // { autoIncrement: true } 自动生成主键
          objectStore = this.db.createObjectStore(name, { keyPath: key });

          // 新建索引
          // 索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）。
          // IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。
          objectStore.createIndex(key, key, { unique: false });
        }
      });
    };
  }

  // 新增数据
  add(tableName, data) {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data);

      request.onsuccess = () => {
        resolve('success');
      };

      request.onerror = () => {
        reject('error');
      };
    });
  }

  // 读取数据
  read(tableName, key): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([tableName]);
      const objectStore = transaction.objectStore(tableName);
      const request = objectStore.get(key);

      request.onerror = () => {
        reject('error');
      };

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          resolve('');
        }
      };
    });
  }

  // 遍历数据
  readAll(tableName) {
    return new Promise((resolve) => {
      const objectStore = this.db.transaction(tableName).objectStore(tableName);

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve('');
        }
      };
    });
  }

  // 更新数据
  update(tableName, data) {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(data);

      request.onsuccess = () => {
        resolve('success');
      };

      request.onerror = () => {
        reject('error');
      };
    });
  }

  // 删除数据
  remove(tableName, key) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(key);

      request.onsuccess = () => {
        resolve('success');
      };
    });
  }

  // 清除数据
  clear(tableName) {
    return new Promise((resolve) => {
      const request = this.db.transaction([tableName], 'readwrite').objectStore(tableName).clear();

      request.onsuccess = () => {
        resolve('success');
      };
    });
  }
}

const IndexedDBService = new IndexedDB();

export default IndexedDBService;
