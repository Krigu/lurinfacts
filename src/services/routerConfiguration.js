import Facts from "./../components/Facts.svelte";
import Images from "./../components/Images.svelte";
import LeafletMap from "./../components/LeafletMap.svelte";
import Home from "./../components/Home.svelte";
import Settings from "./../components/Settings.svelte";
import Login from "./../components/Login.svelte";
import AddPlaceToBe from "./../components/AddPlaceToBe.svelte";
import ShareApiTest from "./../components/ShareApiTest.svelte";
import Contribution from "./../components/Contribution.svelte";
import ManageContribution from "./../components/ManageContribution.svelte";
import ImageFullScreen from "./../components/ImageFullScreen.svelte";

import router from "page";

import { writable } from "svelte/store";

const routeState = writable({
  page: Home,
  params: {},
});

export default function initRouting(registerFn) {
  registerFn("/login", Login, callBackFn);
  registerFn("/home", Home, callBackFn);
  registerFn("/settings", Settings, callBackFn);
  registerFn("/contribute", Contribution, callBackFn);
  registerFn("/contributions", ManageContribution, callBackFn);
  registerFn("/addImage", AddPlaceToBe, callBackFn);
  registerFn("/shareApiTest", ShareApiTest, callBackFn);
  registerFn("/map", LeafletMap, callBackFn);
  registerFn("/images", Images, callBackFn);
  registerFn("/facts", Facts, callBackFn);
  registerFn("/slideShow", ImageFullScreen, callBackFn);
  registerFn("/*", Home, callBackFn);

  router.start();
  return routeState;
}

function callBackFn(page, queryString) {
  routeState.set({
    page: page,
    params: reduceQueryString(queryString),
  });
}

function reduceQueryString(queryString) {
  return queryString.split("&").reduce((red, keyval) => {
    let [key, val] = keyval.split("=");
    red[key] = val;
    return red;
  }, {});
}
