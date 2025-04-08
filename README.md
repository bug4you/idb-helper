<div align="center">
<h1 style="text-align:center;">🚀 idb-helper</h1>
</div>

🚀 **idb-helper** – The easiest way to work with IndexedDB! This library simplifies IndexedDB operations, making it as intuitive as LocalStorage while providing better performance and scalability for large datasets.

[![NPM Version](https://img.shields.io/npm/v/idb-helper)](https://www.npmjs.com/package/idb-helper)
[![License](https://img.shields.io/npm/l/idb-helper)](https://github.com/bug4you/idb-helper/blob/main/LICENSE)

---

## ⚠️ **Warnings & Tips**

🔹 **IndexedDB operates asynchronously** – Always use `await` when calling methods.  
🔹 **Be aware of browser limitations** – Some browsers impose storage limits on IndexedDB.  
🔹 **Version management is crucial** – If the database schema changes, older versions may face issues.  
🔹 **Bulk operations are more efficient** – Use `bulkInsert` and `bulkDelete` for handling large datasets.  
🔹 **Indexed fields improve performance** – `getByIndex` is faster than retrieving all items and filtering manually.  
🔹 **Use instead of LocalStorage** – IndexedDB is a better choice for managing large amounts of data efficiently.

---

## 📦 Installation

Install via NPM:
```sh
npm install idb-helper
```

Install via Yarn:
```sh
yarn add idb-helper
```

Install via Bun:
```bun
bun add idb-helper
```

Or use CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/idb-helper/dist/index.global.js"></script>
```

---

## 🚀 Usage

### 🛠 IDBHelper – Full API Usage
```ts
import { IDBHelper } from "idb-helper";

const db = new IDBHelper("myDatabase", "myStore");

(async () => {
    // 1️⃣ Add a new item
    const id = await db.setItem({ id: 1, name: "Dilshod", age: 27 });
    console.log("New item ID:", id);

    // 2️⃣ Get an item by ID
    const user = await db.getItem(1);
    console.log("Fetched item:", user); // { id: 1, name: "Dilshod", age: 27 }

    // 3️⃣ Get all items
    const allUsers = await db.getAllItems();
    console.log("All items:", allUsers);

    // 4️⃣ Remove an item by ID
    await db.removeItem(1);
    console.log("Item removed.");

    // 5️⃣ Clear all data
    await db.clear();
    console.log("Database cleared.");

    // 6️⃣ Check if an item exists
    const exists = await db.hasItem(1);
    console.log("Item exists:", exists);

    // 7️⃣ Count total items
    const count = await db.count();
    console.log("Total items:", count);

    // 8️⃣ Update an item
    await db.updateItem(1, { name: "Dilshod", age: 28 });
    console.log("Item updated.");

    // 9️⃣ Get item by index
    const indexedItem = await db.getByIndex("name", "Dilshod");
    console.log("Item by index:", indexedItem);

    // 🔟 Get items by filter
    const filteredItems = await db.getItemsByFilter((item) => item.age > 25);
    console.log("Filtered items:", filteredItems);

    // 1️⃣1️⃣ Get items by range
    const rangedItems = await db.getItemsByRange("age", 20, 30);
    console.log("Items in range:", rangedItems);

    // 1️⃣2️⃣ Bulk insert multiple items
    await db.bulkInsert([
        { id: 2, name: "Ali", age: 23 },
        { id: 3, name: "Sara", age: 25 },
    ]);
    console.log("Bulk insert done.");

    // 1️⃣3️⃣ Bulk delete multiple items
    await db.bulkDelete([2, 3]);
    console.log("Bulk delete done.");

    // 1️⃣4️⃣ Close database
    await db.closeDB();
    console.log("Database closed.");
})();
```

## 🛠 Basic Usage in a React Component
_Here’s how you can integrate `idb-helper` in a React component:_
```jsx
import React, { useEffect, useState } from "react";
import {IDBHelper} from "idb-helper";

const db = new IDBHelper("myDatabase", "myStore");

const App = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    // Load all items on component mount
    useEffect(() => {
        const fetchData = async () => {
            const allItems = await db.getAllItems();
            setItems(allItems);
        };
        fetchData();
    }, []);

    // Add a new item
    const handleAddItem = async () => {
        if (!newItem) return;
        const id = await db.setItem({ name: newItem });
        setItems([...items, { id, name: newItem }]);
        setNewItem("");
    };

    // Remove an item
    const handleRemoveItem = async (id) => {
        await db.removeItem(id);
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>IndexedDB React Example</h2>
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter item name"
            />
            <button onClick={handleAddItem}>Add Item</button>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} <button onClick={() => handleRemoveItem(item.id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
```

---

## 🎯 Features
> ✅ Simplifies working with IndexedDB – No more complex transactions!  
> ✅ Works with Promise API – Fully asynchronous and easy to use.  
> ✅ Easy as LocalStorage – Simple `setItem` / `getItem` methods.  
> ✅ Supports Indexed Queries – Fetch items by indexed fields.  
> ✅ Advanced Filtering – Retrieve data using custom filter functions.  
> ✅ Range Queries – Get items between a min/max value.  
> ✅ Bulk Operations – Insert and delete multiple records at once.  
> ✅ Database Management – Clear, count, and close the database easily.  
> ✅ Super Fast – Optimized for large data storage.  
---

## 📖 API
| Method                | Type               | Params                            | Returns                         | Description                                |
|-----------------------|--------------------|-----------------------------------|---------------------------------|--------------------------------------------|
| `setItem<T>`          | `Promise<number>`  | `data: T & { id?: number }`       | `id`                            | Adds or updates an item in the database    |
| `getItem<T>`          | `Promise<T>`       |                                   | `id: number`                    | `T` or `undefined`                         | Retrieves an item by ID |
| `getAllItems<T>`      | `Promise<T[]>`     | `none`                            | `T[]`                           | Fetches all stored items                   |
| `removeItem`          | `Promise<void>`    | `id: number`                      | `void`                          | Deletes an item by ID                      |
| `clear`               | `Promise<void>`    | `none`                            | `void`                          | Clears all items from the database         |
| `hasItem`             | `Promise<boolean>` | `id: number`                      | `true/false`                    | Checks if an item with the given ID exists |
| `count`               | `Promise<number>`  | `none`                            | `number`                        | Returns the total number of stored items   |
| `updateItem<T>`       | `Promise<void>`    | `id: number, updates: Partial<T>` | `void`                          | Partially updates an item by ID            |
| `getByIndex<T>`       | `Promise<T>`       |                                   | `indexName: string, value: any` | `T` or `undefined`                         | Retrieves an item using an index |
| `getItemsByFilter<T>` | `Promise<T[]>`     | `filter: (item: T) => boolean`    | `T[]`                           | Fetches items that match a filter function |
| `getItemsByRange<T>`  | `Promise<T[]>`     | `startId: number, endId: number`  | `T[]`                           | Fetches items within an ID range           |
| `bulkInsert<T>`       | `Promise<void>`    | `items: T[]`                      | `void`                          | Inserts multiple items at once             |
| `bulkDelete`          | `Promise<void>`    | `ids: number[]`                   | `void`                          | Deletes multiple items at once             |
| `closeDB`             | `void`             | `none`                            | `void`                          | Closes the IndexedDB connection            |

---

## 🛠️ Development and Testing
```sh
npm run dev   # Development mode
npm run build # Construction
npm run test  # Run tests
```

---

## 📜 License
MIT - **Free and open source!**

📌 **Author:** [Dilshod Fayzullayev](https://github.com/bug4you)  
📌 **GitHub:** [bug4you/idb-helper](https://github.com/bug4you/idb-helper)
