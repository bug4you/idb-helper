/**
 * A helper class for easy interaction with IndexedDB.
 *
 * This class simplifies working with IndexedDB by providing basic operations
 * such as adding, deleting, updating, and searching for data.
 *
 * ## Usage:
 * ```ts
 * const db = new IDBHelper("myDatabase", "myStore");
 *
 * // Adding data
 * const id = await db.setItem({ name: "Alice", age: 25 });
 * console.log("Added item ID:", id);
 *
 * // Retrieving data
 * const item = await db.getItem(id);
 * console.log("Retrieved item:", item);
 *
 * // Partial update
 * await db.updateItem(id, { age: 26 });
 * console.log("Updated item:", await db.getItem(id));
 *
 * // Retrieving all items
 * const allItems = await db.getAllItems();
 * console.log("All items:", allItems);
 *
 * // Deleting an item
 * await db.removeItem(id);
 * console.log("Item removed.");
 *
 * // Clearing all data
 * await db.clear();
 * console.log("Database cleared.");
 * ```
 */
class IDBHelper {
    private db!: IDBDatabase;

    /**
     * @param {string} dbName - The name of the database
     * @param {string} storeName - The name of the object store
     * @param {number} [version=1] - The version of the IndexedDB
     */
    constructor(
        private readonly dbName: string = "appDB",
        private readonly storeName: string = "dataStore",
        private readonly version: number = 1
    ) {
        this.init();
    }

    /**
     * Opens the IndexedDB and creates the object store if it does not exist.
     */
    private init(): void {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => {
            this.db = request.result;
        };

        request.onerror = () => {
            console.error("Error opening IndexedDB: ", request.error);
        };
    }

    /**
     * Creates an IndexedDB transaction.
     * @param {"readonly" | "readwrite"} mode - The type of transaction.
     * @returns {IDBObjectStore} - Returns the object store instance.
     */
    private tx(mode: IDBTransactionMode): IDBObjectStore {
        return this.db.transaction(this.storeName, mode).objectStore(this.storeName);
    }

    /**
     * Adds or updates an item in the IndexedDB store.
     * If the `id` field is present, the existing item is updated; otherwise, a new item is added.
     *
     * @template T - The type of data.
     * @param {T & { id?: number }} data - The item to be added or updated.
     * @returns {Promise<number>} - The `id` of the saved item.
     */
    setItem<T>(data: T & { id?: number }): Promise<number> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readwrite").put(data);
            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieves an item by its `id` from the IndexedDB store.
     *
     * @template T - The type of data.
     * @param {number} id - The `id` of the item to retrieve.
     * @returns {Promise<T | undefined>} - The found item or `undefined` if not found.
     */
    getItem<T>(id: number): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").get(id);
            request.onsuccess = () => resolve(request.result as T);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieves all items from the IndexedDB store.
     *
     * @template T - The type of data.
     * @returns {Promise<T[]>} - A list of all stored items.
     */
    getAllItems<T>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").getAll();
            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Deletes an item from the IndexedDB store by its `id`.
     *
     * @param {number} id - The `id` of the item to be deleted.
     * @returns {Promise<void>} - Returns nothing upon completion.
     */
    removeItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readwrite").delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clears the storage store by deleting all items.
     *
     * @returns {Promise<void>} - Returns nothing upon completion.
     */
    clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readwrite").clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * 🔹 Checks whether an item with the given `id` exists.
     *
     * @param {number} id - The `id` of the item to check.
     * @returns {Promise<boolean>} - `true` if the item exists, otherwise `false`.
     */
    hasItem(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").get(id);
            request.onsuccess = () => resolve(!!request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 🔹 Retrieves the total number of items in the store.
     *
     * @returns {Promise<number>} - The number of items in the store.
     */
    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 🔹 Partially updates an item by the given `id`.
     *
     * @template T - Data type
     * @param {number} id - The `id` of the item to update.
     * @param {Partial<T>} updates - The updates to apply (`id` cannot be changed).
     * @returns {Promise<void>} - Does not return any value.
     * @throws {Error} - Throws an error if the item is not found.
     */
    updateItem<T>(id: number, updates: Partial<T>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const existing = await this.getItem<T>(id);
                if (!existing) {
                    reject(new Error("Item not found!"));
                    return;
                }

                const updatedData = { ...existing, ...updates, id };
                await this.setItem(updatedData);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 🔹 Search for an item using an index.
     *
     * @template T - Data type
     * @param {string} indexName - The name of the IndexedDB index.
     * @param {any} value - The value to search for.
     * @returns {Promise<T | undefined>} - The found item or `undefined` if not found.
     */
    getByIndex<T>(indexName: string, value: any): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            const store = this.tx("readonly");
            const index = store.index(indexName);
            const request = index.get(value);

            request.onsuccess = () => resolve(request.result as T);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieve items that match the given filter function.
     *
     * @template T - Data type
     * @param {(item: T) => boolean} filter - A filter function to apply to the items.
     * @returns {Promise<T[]>} - An array of items matching the filter criteria.
     */
    getItemsByFilter<T>(filter: (item: T) => boolean): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").getAll();
            request.onsuccess = () => {
                const result = (request.result as T[]).filter(filter);
                resolve(result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieve items within a specified ID range.
     *
     * @template T - Data type
     * @param {number} startId - The starting ID of the range.
     * @param {number} endId - The ending ID of the range.
     * @returns {Promise<T[]>} - An array of items within the specified ID range.
     */
    getItemsByRange<T>(startId: number, endId: number): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = this.tx("readonly").getAll();
            request.onsuccess = () => {
                const result = (request.result as T[]).filter(
                    // @ts-ignore
                    (item) => item.id >= startId && item.id <= endId
                );
                resolve(result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Add multiple items to the store in a single transaction.
     *
     * @template T - The type of data being stored.
     * @param {T[]} items - The list of items to be added.
     * @returns {Promise<void>} - Resolves when all items are successfully added.
     */
    bulkInsert<T>(items: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            items.forEach((item) => store.put(item));

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Remove multiple items from the store in a single transaction.
     *
     * @param {number[]} ids - The list of IDs of the items to be removed.
     * @returns {Promise<void>} - Resolves when all specified items are successfully removed.
     */
    bulkDelete(ids: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            ids.forEach((id) => store.delete(id));

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Closes the IndexedDB connection.
     */
    closeDB(): void {
        if (this.db) {
            this.db.close();
        }
    }
}

// Browser uchun global obyekt yaratamiz
if (typeof window !== "undefined") {
    (window as any).IDBHelper = IDBHelper;
}

export { IDBHelper };
