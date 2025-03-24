<center>
<h1>🚀 idb-helper</h1>
</center> 

🚀 **idb-helper** – makes working with IndexedDB **as easy as LocalStorage**!
This library **simplifies** IndexedDB and makes it **faster to use**.

[![NPM Version](https://img.shields.io/npm/v/idb-helper)](https://www.npmjs.com/package/idb-helper)
[![License](https://img.shields.io/npm/l/idb-helper)](https://github.com/bug4you/idb-helper/blob/main/LICENSE)

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

1️⃣ ESM yoki CommonJS (Node.js, React, Vue, Angular):
### **ESM or CommonJS:**
```ts
import { IDBHelper } from "idb-helper";

const db = new IDBHelper("myDatabase");

// Store data
await db.set("user", { name: "Dilshod", age: 27 });

// Get information
const user = await db.get("user");
console.log(user); // { name: "Dilshod", age: 27 }

// Delete data
await db.delete("user");
```

2️⃣ Use on a regular browser page (via CDN):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>idb-helper Test</title>
    <script src="https://cdn.jsdelivr.net/npm/idb-helper/dist/index.global.js"></script>
</head>
<body>

<script>
    const db = new IDBHelper("myDatabase");

    // Add information
    db.set("user", { name: "Dilshod", age: 25 }).then(() => {
        console.log("User saved!");
    });

    // Get information
    db.get("user").then(user => {
        console.log("User:", user);
    });

    // Delete data
    db.delete("user").then(() => {
        console.log("User deleted!");
    });
</script>

</body>
</html>

```

---

## 🎯 Features
✅ **Simplifies working with IndexedDB**  
✅ **Works with Promise API**  
✅ **Easy to use as LocalStorage**  
✅ **Fast and convenient for large amounts of data**

---

## 📖 API
| Function          | Description         |
|-------------------|---------------------|
| `set(key, value)` | Add or update data  |
| `get(key)`        | Get data            |
| `delete(key)`     | Delete data         |
| `clear()`         | Clear all data      |
| `keys()`          | Get all stored keys |
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