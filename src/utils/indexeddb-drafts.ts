interface DraftData {
  id: string;
  title: string;
  data: any;
  draftType: string;
  createdAt: Date;
  updatedAt: Date;
}

class DraftStorage {
  private dbName = "UniversalDrafts";
  private version = 1;
  private storeName = "drafts";

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("title", "title", { unique: false });
          store.createIndex("draftType", "draftType", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });
  }

  async saveDraft(
    id: string | null,
    title: string,
    data: any,
    draftType: string
  ): Promise<string> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);

        transaction.onerror = () => reject(transaction.error);

        const now = new Date();

        if (id) {
          // Handle existing draft update
          const getRequest = store.get(id);
          getRequest.onsuccess = () => {
            const existingDraft = getRequest.result;
            const draftData = {
              id: String(id),
              title,
              data,
              draftType,
              createdAt: existingDraft?.createdAt || now,
              updatedAt: now,
            };
            const request = store.put(draftData);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(String(id));
          };
          getRequest.onerror = () => reject(getRequest.error);
        } else {
          // Handle new draft
          const newId = Date.now().toString(); // Generate string ID
          const draftData = {
            id: newId,
            title,
            data,
            draftType,
            createdAt: now,
            updatedAt: now,
          };
          console.log("New draft data:", draftData);
          const request = store.add(draftData);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(newId);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  async getDraftById(id: string): Promise<DraftData | null> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => {
        console.error("Error getting draft:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Ensure all dates are Date objects
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
        }
        resolve(result || null);
      };

      transaction.onerror = () => {
        console.error("Transaction error:", transaction.error);
        reject(transaction.error);
      };
    });
  }
  async getAllDraftsByType(draftType: string): Promise<DraftData[]> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("draftType");
      const request = index.getAll(draftType);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const drafts = request.result
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .map((draft) => ({
            ...draft,
            createdAt: new Date(draft.createdAt),
            updatedAt: new Date(draft.updatedAt),
          }));
        resolve(drafts);
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }
  async getAllDrafts(): Promise<DraftData[]> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const drafts = request.result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        resolve(drafts);
      };
      console.log("Drafts result:", request.result);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async deleteDraft(id: string): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(String(id));

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clearAllDrafts(): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const draftStorage = new DraftStorage();
export type { DraftData };
