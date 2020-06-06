import { db } from "./customfirebase";
import { storeFact } from "./../webworker/indexedDbService.js";

let factsArray = [];
var factsDbRef = db.ref("facts");

export function subscribeToFacts(callback) {
  factsDbRef.on("child_added", function (snapshot) {
    let fact = snapshot.val();
    fact.key = snapshot.key;
    let newlyStored = addFacts([fact]);
    callback(newlyStored);
  });
  factsDbRef.on("child_removed", function (snapshot) {
    factsArray = factsArray.filter((p) => p.key !== snapshot.key);
    callback(factsArray);
  });
}

function addFacts(facts) {
  let onlyNewOnes = facts.filter(
    (img) => !factsArray.some((x) => x.key == img.key)
  );
  factsArray.push(...onlyNewOnes);
  factsArray.sort((x, y) => y.insertTime - x.insertTime);

  var newlyAdded = onlyNewOnes.filter(async (x) => storeFact(x));
  return newlyAdded;
}

export function deleteFact(fact) {
  if (fact && fact.key) {
    return factsDbRef
      .child(fact.key)
      .remove()
      .then((error) => {
        if (error) {
          console.log("error delete fact", error);
          return false;
        }
        return true;
      });
  }
  return Promise.resolve(false);
}
