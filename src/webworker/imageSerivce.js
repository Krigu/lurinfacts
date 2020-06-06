import { db, storage } from "./customfirebase";
import { storeImage } from "./../webworker/indexedDbService.js";

let imagesArray = [];
const storageRef = storage.ref();
export function subscribeToImages(callback) {
  console.log("load image from firebase");
  let metaRef = db.ref("imageMetaData");
  metaRef.on("child_added", function (snapshot) {
    let image = snapshot.val();
    image.key = snapshot.key;
    let newlyStored = addImages([image]);
    callback(newlyStored);
  });
  metaRef.on("child_removed", function (snapshot) {
    imagesArray = imagesArray.filter((p) => p.key !== snapshot.key);
    callback(imagesArray);
  });
}

function addImages(images) {
  let onlyNewOnes = images.filter(
    (img) => !imagesArray.some((x) => x.key == img.key)
  );
  imagesArray.push(...onlyNewOnes);
  imagesArray.sort((x, y) => y.insertTime - x.insertTime);
  let newlyAdded = onlyNewOnes.filter(async (x) => storeImage(x));
  return newlyAdded;
}

export function getDownloadUrl(imageKey, callback) {
  let tangRef = storageRef.child("locations/" + imageKey + ".jpg");
  tangRef.getDownloadURL().then((url) => {
    callback(url);
  });
}

export async function loadImageBlobByUrl(url, callback) {
  const response = await fetch(url);
  const blob = await response.blob();
  callback(blob);
}

export function preloadImageByKey(imageKey, callback) {
  let tangRef = storageRef.child("locations/" + imageKey + ".jpg");
  tangRef.getDownloadURL().then(async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    console.log("preloaded image in worker" + url);
    callback(url);
  });
}
