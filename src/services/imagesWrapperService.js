import * as Comlink from "comlink";
import { writable } from "svelte/store";
const worker = new Worker("worker.js");
import { readImages } from "./../webworker/indexedDbService.js";

let newestImages = writable([]);
let imageAdapter = writable([]);
let imagesLoaded = false;
let dataInterface = Comlink.wrap(worker);


export async function subscribeToImages() {
let subscribeableImageStore = loadImages();

return subscribeableImageStore;
}

export async function subscribeToNewestImages() {
  if(!imagesLoaded){
    await loadImages();
  }
  return newestImages;
}

async function loadImages() {
  let images = writable([]);

  const imagesArray = (await readImages()) || [];

  images.set([...imagesArray]);
  newestImages.set(getNewest(imagesArray));

  function callback(f) {
    imageAdapter.set(f);
  }
  console.log("subscribe to images via comlink");
  dataInterface.subscribeToImages(Comlink.proxy(callback));

  imageAdapter.subscribe((f) => {
    var valToAdd = Array.isArray(f) ? f : [f];

    var newImages = valToAdd.filter(
      (x) => !imagesArray.some((a) => a.key == x.key)
    );

    if (newImages.length == 0) {
      return;
    }

    imagesArray.push(...newImages);

    imagesArray.sort((x, y) => y.insertTime - x.insertTime);

    images.set([...imagesArray]);
    imagesLoaded = true;
    newestImages.set(getNewest(imagesArray));
  });
  return images;
}

function getNewest(imagesArray) {
  return imagesArray.filter((x, idx) => idx < 1);
}

export async function deleteImageAndMetadata(...p) {
  return dataInterface.deleteImageAndMetadata(...p);
}

export async function saveImageAndMetadata(...p) {
  return dataInterface.saveImageAndMetadata(...p);
}

export async function loadFullSizeImage(image) {
  if (image.fullImageSizeUrl) {
    return Promise.resolve(image.fullImageSizeUrl);
  }
  const p1 = new Promise(async function (resolve, reject) {
    function callback(url) {
      resolve(url);
    }
    await dataInterface.preloadImageByKey(
      image.imageKey,
      Comlink.proxy(callback)
    );
  });
  return p1;
}