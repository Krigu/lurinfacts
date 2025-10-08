import * as Comlink from "comlink";
import { writable } from "svelte/store";
const worker = new Worker("worker.js");
import { readFacts } from "./../webworker/indexedDbService.js";

let facts = writable([]);
let newestFacts = writable([]);
let factAdapter = writable([]);

let dataInterface = Comlink.wrap(worker);

export async function addFactProposal(...p) {
  return dataInterface.addFactProposal(...p);
}

export async function getFactsProposals(...p) {
  return dataInterface.getFactsProposals(...p);
}

export async function deleteFactProposal(...p) {
  return dataInterface.deleteFactProposal(...p);
}

export async function acceptFactProposal(...p) {
  return dataInterface.acceptFactProposal(...p);
}

export async function deleteFact(...p) {
  return dataInterface.deleteFact(...p);
}

export async function subscribeToFacts() {
  return facts;
}

export async function subscribeToNewestFacts() {
  return newestFacts;
}

async function loadFacts() {
  const factsArray = (await readFacts()) || [];

  facts.set(factsArray);
  newestFacts.set(getNewest(factsArray));

  function callback(f) {
    factAdapter.set(f);
  }
  dataInterface.subscribeToFacts(Comlink.proxy(callback));

  factAdapter.subscribe((f) => {
    var valToAdd = Array.isArray(f) ? f : [f];

    var newFacts = valToAdd.filter(
      (x) => !factsArray.some((a) => a.key == x.key)
    );

    if (newFacts.length == 0) {
      return;
    }

    factsArray.push(...newFacts);

    factsArray.sort((x, y) => y.insertTime - x.insertTime);

    facts.set(factsArray);
    newestFacts.set(getNewest(factsArray));
  });
}

function getNewest(factsArray) {
  return factsArray.filter((x, idx) => idx < 3);
}

loadFacts();
