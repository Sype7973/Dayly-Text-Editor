import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

  export const putDb = async (content) => {
    console.log('Updating database...');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    try {
      const request = store.put({ id: 1,  value: content });
      const result = await request;
    console.log('Data saved to the database');
    } catch (err) {
      console.log(err);
    }
  };
  
  // TODO: Add logic for a method that gets all the content from the database
  export const getDb = async () => {
    console.log('Getting data from database...');
    const jateDb = await openDB('jate', 1);
    const tx = jateDb.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const request = store.get(1);
    const result = await request;
    if (result) {
      console.log('Data retrieved', result);
      return result.value;
    }
    return false;
  };

initdb();
