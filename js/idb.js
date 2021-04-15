// indexedDB stuff
let indexedDB;
if (self.indexedDB) {
    indexedDB = self.indexedDB;
} else {
    indexedDB = window.indexedDB;
}

const request = indexedDB.open('greetings', 1);

let db;

request.onerror = (event) => {
    console.error(event.message)
}

request.onsuccess = (event) => {
    console.log('Opening success')
    db = event.target.result;
    db.onerror = (event) => {
        console.error('Database error', event.target.errorCode)
    }
}

request.onupgradeneeded = (event) => {
    console.log('on upgrade needed');
    const db = event.target.result;
    // When the user is offline, outbox is used as the db
    db.createObjectStore('outbox', { autoIncrement: true });
    db.createObjectStore('inbox', { autoIncrement: true });
}

// name = name of the object store
const saveData = async (name, data) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(name, 'readwrite');
        const store = tx.objectStore(name);
        store.put(data);

        tx.oncomplete = (event) => {
            console.log('put ready');
            resolve(true);
        }

        tx.onerror = (event) => {
            console.error('put error');
            reject('put error');
        }
    });
}

const loadData = async (name) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(name, 'read');
        const store = tx.objectStore(name);
        store.getAll();

        tx.oncomplete = (event) => {
            console.log('getAll ready', event.target.result);
            resolve(event.target.result);
        }

        tx.onerror = (event) => {
            console.error('getAll error');
            reject('getAll error');
        }
    });
}

const clearData = async (name) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(name, 'read');
        const store = tx.objectStore(name);
        store.clear();

        tx.oncomplete = (event) => {
            console.log(`${name} cleared`);
            resolve(true);
        }

        tx.onerror = (event) => {
            console.error('clear error');
            reject('clear error');
        }
    });
}