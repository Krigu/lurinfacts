import { db, storage } from "./customfirebase";
import { triggerPush } from "./pushService";
const firebaseMetaData = db.ref().child("imageMetaData");
const storageRef = storage.ref();
export function saveImageAndMetadata(
  metaData,
  thumbnailImage,
  fullsizeImage,
  originalImage,
  triggerPushMessage
) {
  return saveImage(fullsizeImage, "locations").then((imageKey) => {
    return saveImage(originalImage, "originals").then((imageKeyOriginal) => {
      metaData.imageKey = imageKey;
      metaData.imageKeyOriginal = imageKeyOriginal;
      metaData.thumbnail = thumbnailImage;
      var ok = saveMetaData(metaData);
      if (ok && triggerPushMessage) {
        triggerPush();
      }
      return ok;
    });
  });
}

function saveImage(image, folder) {
  var imageKey = +new Date();
  var ref = storageRef.child(toImageUrl(imageKey, folder));
  return ref.putString(image, "data_url").then(function () {
    return imageKey;
  });
}

function saveMetaData(metaData) {
  var firebaseMetaDataRef = firebaseMetaData.push();
  return firebaseMetaDataRef.set(metaData).then((error) => {
    if (error) {
      return false;
    } else {
      console.log("metadata uploaded under hash:" + firebaseMetaDataRef.key);
      return true;
    }
  });
}

function toImageUrl(imageKey, folder) {
  return folder + "/" + imageKey + ".jpg";
}

export function deleteImageAndMetadata(metaData) {
  return Promise.all([
    deleteMetadata(metaData),
    deleteImage(metaData.imageKey, "locations"),
    metaData.imageKeyOriginal
      ? deleteImage(metaData.imageKeyOriginal, "originals")
      : Promise.resolve(),
  ]);
}

var deleteMetadata = function (metaData) {
  return firebaseMetaData.child(metaData.key).remove();
};

var deleteImage = function (imageKey, folder) {
  var deleteRef = storageRef.child(toImageUrl(imageKey, folder));
  return deleteRef.delete();
};
