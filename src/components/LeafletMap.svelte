<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { Icon } from "@smui/icon-button";
  import { tick } from "svelte";
  import { subscribeToImages } from "./../services/imagesWrapperService.js";

  import page from "page";
  export let params;
  let map;
  let mapElement;
  let markers = [];
  let online = window.navigator.onLine;
  var loadState = "";
  let addedImagesKeys = [];

  function initMap() {
    let initialCoords = [46.65, 7.709];

    map = L.map("map").setView(initialCoords, 6);
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "OSM",
    }).addTo(map);
  }

  function addImageToMap(image) {
    if (markers.some((x) => x.key == image.key)) {
      return;
    }

    var marker = L.marker([
      image.location.latitude,
      image.location.longitude,
    ]).addTo(map);

    markers.push(marker);
    var elementKey = "img_" + image.key;
    var popup = marker.bindPopup(getTemplate(image, elementKey), {
      maxWidth: "auto",
    });
    popup.on("popupopen", function (e) {
      page("/map?key=" + image.key);

      let loadEvent = function () {
        console.log("popupupdated", elementKey);
        e.popup.update();
        document
          .getElementById(elementKey)
          .removeEventListener("load", loadEvent);
      };

      document.getElementById(elementKey).addEventListener("load", loadEvent);
    });
    if (params.key == image.key) {
      popup.openPopup();
    }
  }

  function getTemplate(image, elementKey) {
    return `<div id="content" class="markerPopUp">
    <h2>${image.imageTitle}</h2>
    <div>
    <img id="${elementKey}" src="${image.thumbnail}" alt="${image.imageTitle}" />
    <p>${image.funFact}</p>
    </div></div>`;
  }

  async function addImagesToMap(images) {
    while (images.length > 0) {
      let i = 0;
      while (images.length > 0 && i++ < 10) {
        var img = images.pop();
        if (!addedImagesKeys.find((x) => x.key == img.key)) {
          delayedAdd(img);
          addedImagesKeys.push(img.key);
        }
      }
    }
  }

  function delayedAdd(img) {
    window.setTimeout(function () {
      addImageToMap(img);
    }, 1000 + Math.random() * 7000);
  }

  onMount(async () => {
    if (!online) {
      loadState = "offline";
      return;
    }
    loadState = "loading";
    waitForMapToLoaded();
  });

  const isLoaded = writable(false);

  function loadMapScript() {
    setTimeout(checkIfMapsIsLoaded, 100);
    return isLoaded;
  }

  function checkIfMapsIsLoaded() {
    if (L && L.map) {
      isLoaded.set(true);
    } else {
      setTimeout(checkIfMapsIsLoaded, 300);
    }
  }

  async function waitForMapToLoaded() {
    var observer = loadMapScript();
    observer.subscribe(async (loaded) => {
      if (loaded) {
        loadState = "loaded";
        initMap();
        (await subscribeToImages()).subscribe(addImagesToMap);
      }
    });
  }
</script>

{#if loadState == "loading"}
  <h1>Waiting for OpenStreetMap to load....</h1>
{:else if loadState == "offline"}
  <h1>Sorry, OpenStreetMap only work when online!</h1>
  Go to
  <a href="/images">Images</a>
  instead.
{/if}

<div class="mapContainer">
  <div id="map"></div>
</div>

<style type="text/postcss">
  .mapContainer {
    height: calc(100% - 50px);
    width: 100%;
    position: absolute;
    left: 0px;
  }

  #map {
    height: 100%;
    width: 100%;
  }

  :global(.markerPopUp) {
    padding: 10px;
    min-width: 210px;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    :global(.gm-style-iw-d) {
      background-color: black !important;
      overflow: hidden !important;
    }
    :global(.gm-style-iw) {
      background-color: black !important;
    }
    :global(.gm-style-iw-t::after) {
      background: black !important;
    }
  }
  :global(.markerPopUp img) {
    max-height: 150px;
  }
</style>
