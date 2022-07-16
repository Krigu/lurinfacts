import {
  resizeImage,
  getOrientation,
  loadImage,
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
    let file = new File([data], url, metadata);
    //return handleFile(file, url, resolve, reject);
    return loadImage(url).then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      return handleFile(file, canvas.toDataURL("image/jpeg"), resolve, reject);
    });
  });
}

async function handleFile(file, base64, resolve, reject) {
  let orientation = await getOrientation(file);
  console.log(
    `orientation of photo is: ${orientation.degree}, rotating is switched off.`
  );

  var promiseThumb = resizeImage(base64, maxSizeThumbnailImageInKB);
  var promiseFullsize = resizeImage(base64, maxSizeFullSizeImageInKB);
  return Promise.all([promiseThumb, promiseFullsize, Promise.resolve(base64)])
    .then((r) => {
      resolve(r);
    })
    .catch((e) => {
      console.log(e);
      reject(e);
    });
}
