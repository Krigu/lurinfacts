<script>
  import {
    subscribeToImages,
    deleteImageAndMetadata
  } from "./../services/imagesWrapperService.js";
  import Image from "./Image.svelte";
  import { userStore } from "./../services/loginWrapperService.js";

  import { notify, ask } from "./../services/notifyService.js";
  import { onMount,onDestroy  } from "svelte";

  let images = [];
  let unsubscribe;
  onMount(async function() {
    console.log("images mounted");
    let imageObservable = await subscribeToImages();
    unsubscribe = imageObservable.subscribe(x => {
      console.log("images got imagesData:"+ x.length+ " current count "+images.length);
      images = x;
    });
  });

  onDestroy(async function(){
    unsubscribe();
  });

  let loggedIn = false;
  userStore.subscribe(user => {
    loggedIn = user.loggedIn;
  });

  async function onDeleteLocation(event) {
    let ok = await ask("Do you really want to delete this location?");
    if (ok) {
      deleteLocationSerious(event.detail);
    }
  }

  function deleteLocationSerious(location) {
    deleteImageAndMetadata(location).then(
      () => {
        notify("location was deleted");
      },
      () => {
        notify("something went wrong while deleting the location");
      }
    );
  }
</script>

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

  .list-content p {
    flex: 1 0 auto;
  }
</style>

<div>
  <ul class="list">
    {#each images as image}
      <li class="list-item">
        <Image
          {image}
          hasDeleteButton={loggedIn}
          on:delete={onDeleteLocation} />
      </li>
    {/each}
  </ul>
</div>
