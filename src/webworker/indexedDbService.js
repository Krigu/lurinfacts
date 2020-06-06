import { openDB, deleteDB } from "idb";

const storeName = "lurinfacts_3_0";
const factStoreName = "facts";
const imageStoreName = "images";
//deleting version 2.0
deleteDB("lurinfacts", {});
let dbPromise = null;
async function getDBRef() {
  if (dbPromise != null) {
    return dbPromise;
  }
  dbPromise = await openDB(storeName, 4, {
    upgrade(db, oldVersion, newVersion, transaction) {
      var imageStore = db.createObjectStore(imageStoreName, { keyPath: "key" });
      imageStore.createIndex("insertTime", "insertTime");
      var factsStore = db.createObjectStore(factStoreName, { keyPath: "key" });
      factsStore.createIndex("insertTime", "insertTime");
    },
  });
  return dbPromise;
}

export async function storeFact(fact) {
  return await store(fact, factStoreName);
}

export async function readFacts() {
  return await read(factStoreName);
}

export async function storeImage(image) {
  return await store(image, imageStoreName);
}

export async function readImages() {
  return await read(imageStoreName);
}

export async function store(objectToStore, storeName) {
  var db = await getDBRef();
  var obj = await db.get(storeName, objectToStore.key);
  if (obj) {
    return false;
  }
  console.log("store image/fact in idb", objectToStore);
  await db.put(storeName, objectToStore);
  return true;
}

export async function read(objectStoreName) {
  let objects = [];
  let cursor = await (await getDBRef())
    .transaction(objectStoreName)
    .store.index("insertTime")
    .openCursor(null, "prev");
  while (cursor) {
    objects.push(cursor.value);
    cursor = await cursor.continue();
  }
  return objects;
}
