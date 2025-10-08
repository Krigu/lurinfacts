<script>
  import "./../App.scss";
  import { Icon } from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";

  import { userStore } from "./../services/loginWrapperService.js";

  const dispatch = createEventDispatcher();

  let loggedIn = false;
  userStore.subscribe((user) => {
    loggedIn = user.loggedIn;
  });
  let minimized = true;

  function checkIsOpened(e) {
    if (minimized) {
      toggleMenu();
      e.preventDefault();
    }
    return false;
  }
  function toggleMenu() {
    minimized = !minimized;
    dispatch("message", minimized);
  }
</script>

<nav on:click="{toggleMenu}" class="{minimized ? 'minimized' : ''}">
  <div>
    {#if minimized}
      <div style="display:inline-flex">
        <div id="maskedLogo">&bnsp;</div>
        <span class="pageTitle" style="margin: auto;padding-left: 10px;">
          Lurinfacts
        </span>
      </div>
    {/if}
  </div>
  <div class="menuDiv">
    <ul>
      <li>
        <a on:click="{checkIsOpened}" href="/">Home</a>
      </li>
      <li>
        <a on:click="{checkIsOpened}" href="/facts">Facts</a>
      </li>
      <li>
        <a on:click="{checkIsOpened}" href="/images">Images</a>
      </li>
      <li>
        <a on:click="{checkIsOpened}" href="/map">Map</a>
      </li>
      <li>
        <a on:click="{checkIsOpened}" href="/settings">Settings</a>
      </li>
      <li>
        <a on:click="{checkIsOpened}" href="/login">
          {loggedIn ? "Logout" : "Login"}
        </a>
      </li>
      {#if loggedIn}
        <li>
          <a on:click="{checkIsOpened}" href="/contributions">
            {#if !minimized}
              <Icon class="material-icons">lock</Icon>
            {/if}
            Facts proposals
          </a>
        </li>
        <li>
          <a on:click="{checkIsOpened}" href="/addImage">
            {#if !minimized}
              <Icon class="material-icons">lock</Icon>
            {/if}
            Add image
          </a>
        </li>
      {/if}
    </ul>
  </div>
  {#if minimized}
    <div style="justify-self: end;margin-top: 5px;">
      <a
        class="twitterLink"
        target="_blank"
        rel="noopener"
        href="https://www.twitter.com/lurin_tha_one"
        alt="follow Lurin on twitter"
      >
        <img src="./../assets/twitter_logo.png" alt="Twitter Logo" />
      </a>
    </div>
  {/if}
</nav>

<style type="text/postcss">
  .pageTitle {
    color: var(--mdc-theme-on-primary, black);
  }

  nav {
    display: grid;
    grid-template-columns: 1px auto 1px;
    background-color: var(--mdc-theme-primary, yellow);
    height: calc(100vh - 20px);
    padding: 10px;
    transition: 0.5s;
    cursor: pointer;
  }
  nav.minimized {
    grid-template-columns: 1fr 25px 1fr;
    height: 30px;
    transition: 2s;
  }

  ul {
    list-style: none;
    transition: 0.5s;
  }

  nav.minimized ul {
    width: 25px;
    margin: 0px;
    margin-top: 5px;
    transition: 1s;
  }

  li {
    text-align: center;
    padding: 10px 20px;
    margin-bottom: 10px;
    font-size: 30px;
    transition: 0.5s;
  }
  a {
    color: var(--mdc-theme-on-primary, black);
  }

  nav.minimized ul li {
    background-color: var(--mdc-theme-on-primary, black);
    margin-bottom: 0px;
    padding: 0px;
    transition: 1s;
  }

  .menuDiv {
    margin: auto;
  }

  nav.minimized ul > li:nth-child(-n + 3) {
    margin-bottom: 3px;
    transition: 1s;
    padding: 2px 3px;
    transition: 1s;
  }

  nav.minimized ul li a {
    display: none;
    transition: 1s;
  }

  #maskedLogo {
    width: 30px;
    height: 30px;
    background-color: var(--mdc-theme-on-primary, black);
    -webkit-mask-image: url(./../assets/lurinfacts-icon-transparent.webp);
    mask-image: url(./../assets/lurinfacts-icon-transparent.webp);
  }
</style>
