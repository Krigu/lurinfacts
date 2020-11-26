<script>
  import { getDisplayTime } from "../services/displayTime.js";
  import { createEventDispatcher } from "svelte";
  import Button, { Label } from "@smui/button";
  import page from "page";
  import { onMount } from "svelte";

  export let image;
  export let hasDeleteButton;

  let pathName = location.pathname || "home";
  pathName = pathName.indexOf("/") == 0 ? pathName.substring(1) : PathName;
  let imageContainer;
  let landscapeClass = "portrait";
  let displayUrl = "";

  const dispatch = createEventDispatcher();

  onMount(async function() {
    var intersectionObserver = new IntersectionObserver(function(entries) {
      if(entries[0].intersectionRatio > 0){
        console.log("intersection observer for "+image.imageTitle,entries );
        displayUrl = image.thumbnail;
      }
    });
    intersectionObserver.observe(imageContainer);
  });

  function deleteLocation(e) {
    e.stopPropagation();
    dispatch("delete", image);
  }

  function imageLoaded(e) {
    if (e.target.width > e.target.height) {
      landscapeClass = "landscape";
    }
  }
</script>

<style>
  .imageContainer {
    margin: 5px;
    background-color: #ffff65;
    font-size: 18px;
    border-radius: 6px;
    width: 100%;
  }
  .imageContainer > div {
    padding: 16px;
  }
  @media (prefers-color-scheme: dark) {
    .imageContainer {
      color: black;
    }
  }
  .imageText {
    width: 100%;
    overflow: auto;
  }
  .imageSubtitle {
    font-size: 12px;
    text-align: right;
  }

  .square {
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin: 6px auto;
    cursor: pointer;
  }
  img {
    position: absolute;
    max-width: 100%;
    width: 100%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img.landscape {
    height: 100%;
    width: auto;
    object-fit: cover;
  }
</style>

<div bind:this={imageContainer}
  class="imageContainer mdc-card"
  on:click={() => page('/slideShow?key=' + image.key + '&backUrl=' + pathName)}>
  <div>
    <div class="imageText">{image.imageTitle}</div>
    <div class="square">
      <img
        src={displayUrl}
        class={landscapeClass}
        on:load={imageLoaded}
        alt={image.funFact} />
    </div>
    <div class="imageText">{image.funFact}</div>
    <div class="imageSubtitle">{getDisplayTime(image.insertTime)}</div>
    {#if hasDeleteButton}
      <Button on:click={deleteLocation} variant="raised" class="formButton">
        <Label>Delete location</Label>
      </Button>
    {/if}
  </div>
</div>
