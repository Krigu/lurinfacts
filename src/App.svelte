<script>
  import "./App.scss";
  import Facts from "./components/Facts.svelte";
  import Images from "./components/Images.svelte";
  import GMap from "./components/GoogleMap.svelte";
  import LeafletMap from "./components/LeafletMap.svelte";
  import Home from "./components/Home.svelte";
  import Settings from "./components/Settings.svelte";
  import Login from "./components/Login.svelte";
  import FullScreenMenu from "./components/FullScreenMenu.svelte";
  import AddPlaceToBe from "./components/AddPlaceToBe.svelte";
  import ImageFullScreenSwipe from "./components/ImageFullScreenSwipe.svelte";
  import ShareApiTest from "./components/ShareApiTest.svelte";
  import Contribution from "./components/Contribution.svelte";
  import ManageContribution from "./components/ManageContribution.svelte";
  import Notification from "./components/Notification.svelte";
  import router from "page";

  let page;
  let params = {};

  router("/login", () => (page = Login));
  router("/home", () => (page = Home));
  router("/settings", () => (page = Settings));
  router("/contribute", () => (page = Contribution));
  router("/contributions", () => (page = ManageContribution));
  router("/addImage", () => (page = AddPlaceToBe));
  router("/shareApiTest", () => (page = ShareApiTest));
  router("/facts", () => (page = Facts));
  router("/gmap", () => (page = GoogleMap));
  router("/map", () => (page = LeafletMap));
  router("/images", () => (page = Images));

  router(
    "/facts?key=:factKey",
    (ctx, next) => {
      params = ctx.params;
      next();
    },
    () => (page = Facts)
  );

  router(
    "/slideShow",
    (ctx, next) => {
      params = ctx.querystring.split("&").reduce((red, keyval) => {
        let [key, val] = keyval.split("=");
        red[key] = val;
        return red;
      }, {});
      next();
    },
    () => (page = ImageFullScreenSwipe)
  );

  router("/*", () => (page = Home));
  router.start();

  let menuOpened = false;
  function menuOpen() {
    menuOpened = !menuOpened;
  }
</script>

<style>
  :global(body) {
    margin: 0px;
  }

  :global(.formButton) {
    margin-top: 20px;
    margin-left: 10px;
    float: right;
  }

  :global(.contentpadding) {
    padding: 0px 20px;
  }
  :global(.mdc-top-app-bar) {
    height: 50px;
  }

  :global(app, body, html) {
    display: block !important;
    height: auto !important;
    width: auto !important;
    position: static !important;
    font-family: Roboto, sans-serif;
  }
</style>

<FullScreenMenu on:message={menuOpen} />
<main class="mainContainer" style={menuOpened ? 'display:none' : ''}>
  <svelte:component this={page} {params} />
</main>
<Notification />
