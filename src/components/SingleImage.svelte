<script>
  import {
    loadImageMetaData,
    loadFullSizeImage,
  } from "./../services/imagesWrapperService.js";
  import Image from "./Image.svelte";
  import { onMount, onDestroy } from "svelte";

  export let params;

  let loadingImage = {
    imageTitle: "Loading...",
    funFact: "Lurin is loading the image for you.",
    thumbnail: "assets/image_placeholder.jpg",
    insertTime: new Date(),
  };
  let image = {};
  let unsubscribe;
  onMount(async function () {
    console.log("image mounted");
    let imageObservable = await loadImageMetaData(params.key);
    unsubscribe = imageObservable.subscribe((x) => {
      if (!x.imageTitle) return;
      console.log("image got imageData:", x);
      x.imageUrlForDisplay = x.thumbnail;
      image = x;
      loadingImage = null;

      loadFullSizeImage(image).then((url) => {
        image.fullImageSizeUrl = url;
        console.log(
          "loadFullSizeImage ok for: " +
            image.imageTitle +
            "imageKey; " +
            image.imageKey
        );
        image.imageUrlForDisplay = url;
      });
    });
  });

  onDestroy(async function () {
    unsubscribe();
  });
</script>

<div>
  <ul class="list">
    {#if loadingImage != null}
      <li class="list-item">
        <Image image="{loadingImage}" hasDeleteButton="{false}" />
      </li>
    {/if}
    {#if image.imageTitle != null}
      <li class="list-item">
        <Image image="{image}" hasDeleteButton="{false}" />
      </li>
    {/if}
  </ul>
</div>

<style type="text/postcss">
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
  .list-item {
    display: flex;
    padding: 0.5em;
    width: 300px;
  }
</style>
