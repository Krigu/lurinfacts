<script>
  import IconButton from "@smui/icon-button";
  import {
    subscribeToImages,
    loadFullSizeImage,
  } from "./../services/imagesWrapperService.js";
  import { getDisplayTime } from "../services/displayTime.js";
  import { tick, onMount } from "svelte";
  import { notifyInAWhile } from "./../services/notifyService.js";

  import page from "page";
  export let params;

  let currentIndex = 0;
  const canShare = "canShare" in navigator;
  let storiesElement;
  let images = [];
  let backUrl = params.backUrl;

  onMount(async function () {
    let imageObservable = await subscribeToImages();
    imageObservable.subscribe((x) => {
      var idx = x.findIndex((y) => y.key == params.key);
      //console.log("default index is:", idx);
      images = x;
      if (idx != -1) {
        currentIndex = idx;
      } else {
        currentIndex = Math.max(x.length - 1, 0);
      }
      if (x.length > 0) {
        preloadImageRange(currentIndex);
      }
    });

    notifyInAWhile(
      "use arrow keys or click to navigate between images.",
      "image_navigate",
      30 * 24 * 60 * 60
    );
    await tick();

    storiesElement.addEventListener("click", (e) => {
      console.log("got click event", e.clientX);
      if (e.target.nodeName !== "ARTICLE") return;
      var median = e.currentTarget.offsetLeft + e.currentTarget.clientWidth / 2;
      navigateStories(e.clientX > median ? "next" : "prev");
    });
  });

  document.addEventListener("keydown", ({ key }) => {
    if (key !== "ArrowDown" || key !== "ArrowUp")
      navigateStories(key === "ArrowDown" ? "next" : "prev");
  });

  async function shareImage(e) {
    let image = images[currentIndex];
    let response = await fetch(image.fullImageSizeUrl);
    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File([data], image.key + ".jpg", metadata);
    const files = [file];
    if (canShare && navigator.canShare({ files })) {
      try {
        navigator.share({ files });
      } catch (ex) {
        console.log("sharerror", ex);
      }
    }
  }
  async function showOnMap() {
    page("/map?key=" + images[currentIndex].key);
  }

  async function closeSlideShow() {
    page(
      "/" +
        backUrl +
        "#:~:text=" +
        encodeURIComponent(images[currentIndex].imageTitle)
    );
  }

  const navigateStories = (direction) => {
    var state = {
      current_story: storiesElement.children[0].children[currentIndex],
    };

    const story = state.current_story;
    const lastItemInUserStory = story.parentNode.lastElementChild;
    const firstItemInUserStory = story.parentNode.firstElementChild;
    console.log(
      "story " +
        story.innerText +
        " last: " +
        lastItemInUserStory.innerText +
        " first " +
        firstItemInUserStory.innerText,
      currentIndex
    );
    if (direction === "next") {
      if (lastItemInUserStory === story) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
    } else if (direction === "prev") {
      if (firstItemInUserStory === story) {
        currentIndex = images.length - 1;
      } else {
        currentIndex--;
      }
    }
    console.log("new index is:", currentIndex);
    page(
      "/slideShow?key=" +
        images[currentIndex].key +
        "&backUrl=" +
        params.backUrl
    );
    preloadImageRange(currentIndex);
  };

  function getIndex(idx) {
    if (idx < 0) {
      idx = images.length - 1;
    }
    if (images.length <= idx) {
      idx = 0;
    }
    return idx;
  }

  function preloadImageRange(defaultIndex) {
    preloadImage(defaultIndex);
    preloadImage(defaultIndex + 1);
    preloadImage(defaultIndex - 1);
  }

  function preloadImage(idx) {
    idx = getIndex(idx);
    let i = images[idx];
    if (i.fullImageSizeUrl) {
      i.imageUrlForDisplay = i.fullImageSizeUrl;
      console.log(i.imageTitle + " is already preloaded");
      return;
    }
    //use thumbnail as loong as full screen is not available
    i.imageUrlForDisplay = i.thumbnail;

    loadFullSizeImage(i).then((url) => {
      i.fullImageSizeUrl = url;
      console.log(
        "preload ok for: " +
          i.imageTitle +
          "imageKey; " +
          i.imageKey +
          " idx: " +
          idx
      );
      i.imageUrlForDisplay = url;
      images[idx] = Object.assign({}, i);
    });
  }
</script>

<div class="slideContainer">
  <div class="stories" bind:this="{storiesElement}">
    <section class="user">
      {#each images as image, i}
        <article
          class="story {i != currentIndex ? 'hidden' : ''}"
          style="{"background-image: url('" + image.imageUrlForDisplay + "');"}"
        >
          <div class="textContainer">
            <div>
              <div>
                <span class="title">{image.imageTitle}</span>
              </div>
              <div class="text">{image.funFact}</div>
              <div class="text">{getDisplayTime(image.insertTime)}</div>
            </div>
            <div></div>
          </div>
        </article>
      {/each}
    </section>
  </div>
  <div class="actionButtons">
    <IconButton
      on:click="{showOnMap}"
      class="material-icons actionButton"
      aria-label="Open map"
    >
      place
    </IconButton>
    {#if canShare}
      <IconButton
        on:click="{shareImage}"
        class="material-icons actionButton"
        aria-label="Share"
      >
        share
      </IconButton>
    {/if}
    <IconButton
      on:click="{closeSlideShow}"
      class="material-icons actionButton"
      aria-label="Close"
    >
      close
    </IconButton>
  </div>
</div>

<style type="text/postcss">
  .slideContainer {
    min-height: 100vh;
    display: grid;
    align-items: center;
    justify-items: center;
    place-items: center;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
      Noto Sans, sans-serif;
    margin: 0;
    background: hsl(200, 15%, 93%);
    position: absolute;
    top: 0px;

    /* parent owned aspects of the responsive stories */
  }

  .slideContainer > .stories {
    width: 100vw;
    height: 100vh;
  }

  .slideContainer > .stories {
    padding: inherit;
    /* desktop constraint */
  }

  .stories {
    display: grid;
    grid: 1fr / auto-flow 100%;
    grid-gap: 1ch;
    gap: 1ch;
    overflow-x: auto;
    -ms-scroll-snap-type: x mandatory;
    scroll-snap-type: x mandatory;
    -ms-scroll-chaining: none;
    overscroll-behavior: contain;
    touch-action: pan-x;
  }

  .user {
    /* outer */
    scroll-snap-align: start;
    scroll-snap-stop: always;

    /* inner */
    display: grid;
    grid: [story] 1fr / [story] 1fr;
  }

  .story {
    width: 100vw;
    grid-area: story;
    background-size: cover;
    background-image: var(--bg),
      linear-gradient(to top, rgb(249, 249, 249), rgb(226, 226, 226));
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1),
      background-position-x 9s, background-position-y 9s;
    background-position-x: 0%;
    background-position-y: 0%;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
    background-position-x: 100%;
    background-position-y: 100%;
  }

  .textContainer {
    background-color: #000;
    background-color: rgb(255 255 101 / 0.7);
    border: 1px solid #000;
    border-radius: 20px;
    padding: 10px;
    margin: 10px;
  }

  .textContainer .title {
    font-size: 20px;
    font-weight: bold;
  }
  .textContainer .text {
    font-size: 14px;
  }
  .actionButtons {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
  }

  :global(button.actionButton) {
    background-color: #000;
    background-color: rgba(255, 255, 101, 0.7);
    border: 1px solid #000;
    border-radius: 30px;
  }
</style>
