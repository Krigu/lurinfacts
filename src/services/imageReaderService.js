import {
  resizeImage,
  getOrientation,
  rotatePhoto,
} from "./imageResizeService.js";

const maxSizeFullSizeImageInKB = 300;
const maxSizeThumbnailImageInKB = 30;

export async function readFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = async function (e) {
      handleFile(file, e.target.result, resolve, reject);
    };
    reader.readAsDataURL(file);
  });
}

export async function getImageFormUrl(url) {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File([data], "test.jpg", metadata);
    handleFile(file, url, resolve, reject);
  });
}

async function handleFile(file, url, resolve, reject) {
  let orientation = await getOrientation(file);
  console.log(
    `orientation of photo is: ${orientation.degree}, rotating is switched off.`
  );
  // var rotatedResult = await rotatePhoto(url, orientation.degree);
  var promiseThumb = resizeImage(url, maxSizeThumbnailImageInKB);
  var promiseFullsize = resizeImage(url, maxSizeFullSizeImageInKB);
  return Promise.all([promiseThumb, promiseFullsize, Promise.resolve(url)])
    .then((r) => {
      resolve(r);
    })
    .catch((e) => {
      console.log(e);
      reject(e);
    });
}
