// Handles IndexedDB operations
export class StorageService {
    private static readonly DB_NAME = 'localAuthDB';
    private static readonly DB_VERSION = 1;
    private static readonly STORE_NAME = 'users';
  
    private static async openDB(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'username' });
          }
        };
      });
    }
  
    static async saveUser(userData: {
      username: string;
      encryptedData: ArrayBuffer;
      salt: Uint8Array;
      iv: Uint8Array;
    }): Promise<void> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
  
        const request = store.put({
          username: userData.username,
          encryptedData: Array.from(new Uint8Array(userData.encryptedData)),
          salt: Array.from(userData.salt),
          iv: Array.from(userData.iv)
        });
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    static async getUser(username: string): Promise<{
      encryptedData: Uint8Array;
      salt: Uint8Array;
      iv: Uint8Array;
    } | null> {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(username);
  
        request.onsuccess = () => {
          if (!request.result) {
            resolve(null);
            return;
          }
  
          resolve({
            encryptedData: new Uint8Array(request.result.encryptedData),
            salt: new Uint8Array(request.result.salt),
            iv: new Uint8Array(request.result.iv)
          });
        };
  
        request.onerror = () => reject(request.error);
      });
    }
  }