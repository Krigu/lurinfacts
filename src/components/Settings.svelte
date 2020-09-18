<script>
  import {
    disablePush,
    enablePush,
    getCurrentSubscription
  } from "./../services/pushNotificationService.js";
  import { notify } from "./../services/notifyService.js";
  import Button, { Label } from "@smui/button";

  let isWorking = false;
  let hasServiceWorker = "serviceWorker" in navigator;
  let isPushFeatured = hasServiceWorker && "PushManager" in window;

  async function togglePush(disable) {
    isWorking = true;
    var result = "";
    if (disable) {
      result = await disablePush();
    } else {
      result = await enablePush();
    }
    notify(result.msg);
    isWorking = false;
  }

  async function clearStorage() {
    localStorage.clear();
    if (!window.indexedDB) {
      return;
    }
    console.log("delete indexedDB named lurinfacts_3_0");
    window.indexedDB.deleteDatabase("lurinfacts_3_0");
    notify("All cleared!");
  }

  function unregisterServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
        notify("ServiceWorker kicked!");
      }
    });
  }
</script>

<style type="text/postcss">
  .configItem {
    padding-bottom: 60px;
  }
</style>

<div class="contentpadding">

  <div class="configItem">
    <h1>Settings</h1>

    <h2>Push Notifications</h2>
    <p>Get the latest and greatest news about lurins trips and wisdom.</p>
    {#if isPushFeatured}
      <Button
        on:click={() => togglePush(true)}
        disabled={isWorking}
        variant="raised"
        class="formButton">
        <Label>Disable</Label>
      </Button>
      <Button
        on:click={() => togglePush(false)}
        disabled={isWorking}
        variant="raised"
        class="formButton">
        <Label>Enable</Label>
      </Button>
    {:else}
      <p>
        Sorry, your browser doesn't feature push notification. Ask lurin how to
        download a real browser
      </p>
    {/if}
  </div>
  <div class="configItem">

    <h2>Cache</h2>
    <p>Clear LocalStorage and IndexDB</p>
    <Button on:click={() => clearStorage()} variant="raised" class="formButton">
      <Label>Clear</Label>
    </Button>
  </div>
  <div class="configItem">
    {#if hasServiceWorker}
      <h2>Service Worker</h2>
      <Button
        on:click={() => unregisterServiceWorker()}
        variant="raised"
        class="formButton">
        <Label>Unregister Service Worker</Label>
      </Button>
    {/if}
  </div>

</div>
