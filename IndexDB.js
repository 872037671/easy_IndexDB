class IndexDB {
  constructor (options) {
    this.options = options;
    this.request;
    this.db;
    this.createDB();
  }
  createDB() {
    if (!this.options) {
      this.request = window.indexedDB.open('MyDb', new Date().getTime());
    } else {
      this.options.name ? this.dbName = this.options.name : this.options.name='MyDb';
      this.options.version ? this.version = this.options.version : this.version = new Date().getTime();
      this.request = window.indexedDB.open(this.dbName, this.version);
    }
    this.request.onerror = function(event) {
      alert('create error')
    };
    this.request.onsuccess = function(event) {
      this.db = event.target.result;
    }.bind(this);
    this.request.onupgradeneeded = function (event) {
      this.db = event.target.result;
      let transaction= event.target.transaction,store;
      if(!this.db.objectStoreNames.contains(this.options.storeName)){
        store = this.db.createObjectStore(this.options.storeName,{keyPath: this.options.keyPath});
      }
    }.bind(this);
  }
  static createInstance(options) {
    return new IndexDB(options)
  }
  setItem(key, data) {
    return new Promise((reslove) => {
      let store = this.db.transaction(this.options.storeName, 'readwrite')
      .objectStore(this.options.storeName);
      let request = store.get(key);
      request.onsuccess = function(e) {
        if (!e.target.result) {
          let add_request = store.add(data);
          add_request.onsuccess = function(e) {
            reslove(data)
          }
        } else {
          let put_request = store.put(data);
          put_request.onsuccess = function(e) {
            reslove(data)
          }
        }
      }
    })
  }
  update_cursor(cursor, value, resolve, reject) {
    let updaterequest = cursor.update(value);
    updaterequest.onsuccess = function() {
      resolve(value)
    }
    updaterequest.onerror = function(e) {
      reject(e)
    }
    
  }
  delete_cursor(cursor, value, resolve, reject) {
    let deleterequest = cursor.delete();
    deleterequest.onsuccess = function() {
      resolve(value)
    }
    deleterequest.onerror = function(e) {
      reject(e)
    }
  }
  cursorItem(key, value, type) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let store = this.db.transaction(this.options.storeName,'readwrite')
      .objectStore(this.options.storeName), request;
      request = store.openCursor();
      request.onsuccess = function(e) {
        let cursor = e.target.result;
        if (cursor) {
          if (cursor.key == key) {
            switch(type) {
              case 'update':
              console.log(key)
                _this.update_cursor(cursor, value, resolve, reject);
                break;
              case 'delete':
                _this.delete_cursor(cursor, value, resolve, reject);
                break;
            }
          } else {
            cursor.continue()
          }
        }
      }
      request.onerror = function(e) {
        resolve(e)
      }
    })
  }
  getItem(key) {
    return new Promise((resolve) => {
      let store = this.db.transaction(this.options.storeName,'readwrite')
      .objectStore(this.options.storeName), request;
      request = store.get(key);
      request.onsuccess = function(e) {
        resolve(e.target.result)
      }
      request.onerror = function(e) {
        resolve(e)
      }
    })
  }
  clearItem(key) {
    return new Promise((resolve) => {
      let store = this.db.transaction(this.options.storeName,'readwrite')
      .objectStore(this.options.storeName), request;
      request = store.clear(key);
      request.onsuccess = function(e) {
        resolve('clear success')
      }
      request.onerror = function(e) {
        resolve(e)
      }
    })
  }
  delItem(key) {
    return new Promise((resolve) => {
      let store = this.db.transaction(this.options.storeName,'readwrite')
      .objectStore(this.options.storeName), request;
      request = store.delete(key);
      request.onsuccess = function(e) {
        resolve('delete success')
      }
      request.onerror = function(e) {
        resolve(e)
      }
    })
  }
  close() {
    this.db.close();
  }
  static delete(name) {
    indexedDB.deleteDatabase(name);
  }
}
