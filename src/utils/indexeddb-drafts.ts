interface DraftData {
    id?: string
    title: string
    data: any
    draftType: string
    createdAt: Date
    updatedAt: Date
  }
  
  class DraftStorage {
    private dbName = "UniversalDrafts"
    private version = 1
    private storeName = "drafts"
  
    private async openDB(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version)
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, {
              keyPath: "id",
              autoIncrement: true,
            })
            store.createIndex("title", "title", { unique: false })
            store.createIndex("draftType", "draftType", { unique: false })
            store.createIndex("updatedAt", "updatedAt", { unique: false })
          }
        }
      })
    }
  
    async saveDraft(id: string | null, title: string, data: any, draftType: string): Promise<string> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([this.storeName], "readwrite")
          const store = transaction.objectStore(this.storeName)
  
          transaction.onerror = () => reject(transaction.error)
  
          if (id) {
            // Update existing draft
            const getRequest = store.get(id)
  
            getRequest.onsuccess = () => {
              const existingDraft = getRequest.result
              const draftData: DraftData = {
                id: id,
                title,
                data,
                draftType,
                createdAt: existingDraft ? existingDraft.createdAt : new Date(),
                updatedAt: new Date(),
              }
  
              const putRequest = store.put(draftData)
              putRequest.onerror = () => reject(putRequest.error)
              putRequest.onsuccess = () => resolve(id)
            }
  
            getRequest.onerror = () => reject(getRequest.error)
          } else {
            // Create new draft
            const draftData: DraftData = {
              title,
              data,
              draftType,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
  
            const addRequest = store.add(draftData)
            addRequest.onerror = () => reject(addRequest.error)
            addRequest.onsuccess = () => resolve(addRequest.result.toString())
          }
        } catch (error) {
          reject(error)
        }
      })
    }
  
    async getDraftById(id: string): Promise<DraftData | null> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.get(id)
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result || null)
        transaction.onerror = () => reject(transaction.error)
      })
    }
  
    async getAllDraftsByType(draftType: string): Promise<DraftData[]> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const index = store.index("draftType")
        const request = index.getAll(draftType)
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const drafts = request.result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          resolve(drafts)
        }
        transaction.onerror = () => reject(transaction.error)
      })
    }
  
    async getAllDrafts(): Promise<DraftData[]> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.getAll()
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const drafts = request.result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          resolve(drafts)
        }
        transaction.onerror = () => reject(transaction.error)
      })
    }
  
    async deleteDraft(id: string): Promise<void> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(id)
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })
    }
  
    async clearAllDrafts(): Promise<void> {
      const db = await this.openDB()
  
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.clear()
  
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })
    }
  }
  
  export const draftStorage = new DraftStorage()
  export type { DraftData }
  