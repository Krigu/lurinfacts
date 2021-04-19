import { writable } from "svelte/store";

export const notificationStore = writable("");
export const questionStore = writable("");

export function notify(msg) {
  notificationStore.set({ msg, time: +new Date() });
}

export function notifyInAWhile(msg, key, secondsInFuture) {
  let storageKey = "notifyKey_" + key;
  var nextInfoShow = localStorage.getItem(storageKey) || Date.now();
  if (+nextInfoShow < Date.now()) {
    notify(msg);
    localStorage.setItem(storageKey, Date.now() + secondsInFuture + 1000);
  }
}
export function ask(msg) {
  return new Promise((resolve, reject) => {
    questionStore.set({ msg, time: +new Date(), resolve, reject });
  });
}
