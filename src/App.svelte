<script>
  import "./App.scss";

  import Notification from "./components/Notification.svelte";
  import router from "page";
  import Home from "./components/Home.svelte";
  import { userStore } from "./services/loginWrapperService.js";
  import { addMediaToCache } from "./services/imageMediaDataCache.js";
  import FullScreenMenu from "./components/FullScreenMenu.svelte";
  import initRouting from "./services/routerConfiguration.js";
  let page = Home;
  let params = {};

  let isLoggedIn = false;
  let isDropable = false;
  userStore.subscribe((user) => {
    isLoggedIn = user.loggedIn;
  });

  let registerFn = function registerFn(path, component, fn) {
    router(
      path,
      (ctx, next) => {
        fn(component, ctx.querystring);
        next();
      },
      () => {}
    );
  };

  initRouting(registerFn).subscribe((newState) => {
    page = newState.page;
    params = newState.params;
  });

  let menuOpened = false;
  function menuOpen() {
    menuOpened = !menuOpened;
  }

  function dragover(e) {
    if (isLoggedIn && !isDropable) {
      isDropable = true;
    }
    //needed so that the drop event is fired.
    e.preventDefault();
  }
  function dragended() {
    isDropable = false;
  }

  async function dropped(event) {
    for (let type of event.dataTransfer.types) {
      console.log({ type, data: event.dataTransfer.getData(type) });
      if (type == "Files") {
        handleFiles(event.dataTransfer).then((filesCached) => {
          if (filesCached) {
            router("/addImage?shareTarget");
          }
        });
      } else if (type == "text/plain") {
        router(
          "/contribute?q=" +
            encodeURIComponent(event.dataTransfer.getData(type))
        );
      } else {
        console.log("unhandled drop type", type);
      }
    }
    isDropable = false;
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  async function handleFiles(dataTransfer) {
    let waitForFileSave = [];
    if (dataTransfer.files) {
      waitForFileSave.push(
        await [...dataTransfer.files].map(async (file) => {
          await addMediaToCache("", file);
        })
      );
    }
    if (dataTransfer.getData("Files")) {
      waitForFileSave.push(
        await addMediaToCache("", dataTransfer.getData("Files"))
      );
    }
    if (!waitForFileSave.length) {
      return Promise.resolve(false);
    }
    return Promise.all(waitForFileSave).then(() => true);
  }
</script>

<div
  id="mainDiv"
  class="{isDropable ? 'dropable' : ''}"
  on:dragover="{dragover}"
  on:dragleave="{dragended}"
  on:drop="{dropped}"
>
  <FullScreenMenu on:message="{menuOpen}" />
  <main class="mainContainer" style="{menuOpened ? 'display:none' : ''}">
    <svelte:component this="{page}" params="{params}" />
  </main>
  <Notification />
</div>

<style>
  :global(body) {
    margin: 0px;
  }

  .dropable {
    box-shadow: inset 0 0 40px 9px #2a36e0;
    opacity: "0.4";
    cursor: move;
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
