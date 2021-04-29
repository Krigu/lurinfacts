<script>
  import { addFactProposal } from "./../services/factsWrapperService.js";
  import { notify } from "./../services/notifyService.js";
  import { form } from "svelte-forms";
  import Button, { Label } from "@smui/button";

  let factObj = { fact: "", contributor: "" };
  let startedTypingAt = null;
  let charsTyped = 0;
  let isFastTyper = false;
  let timeoutHandle = null;

  const contributeForm = form(() => ({
    fact: { value: factObj.fact, validators: ["required", "min:5", "max:150"] },
    contributor: {
      value: factObj.contributor,
      validators: ["required", "min:5", "max:80"],
    },
  }));

  function sendContribution(e) {
    e.preventDefault();
    factObj.insertTime = new Date().getTime();
    if (!navigator.onLine) {
      notify(
        "Your internet connection is lost and lurin couldn't fix it. try later."
      );
      return false;
    }
    return addFactProposal(factObj).then(
      function () {
        factObj.fact = "";
        factObj.contributor = "";
        notify("fact added, lurin will decide if it's worth it");
      },
      function (e) {
        console.log("error on save:", e);
        notify("lurin doesn't like this fact, error during save.");
      }
    );
  }

  function speedCheck() {
    if (startedTypingAt == null) {
      startedTypingAt = +new Date();
    }
    charsTyped++;
    let secondsSinceStartedTyping = (+new Date() - startedTypingAt) / 1000.0;
    let charsPerSecond = charsTyped / secondsSinceStartedTyping;
    isFastTyper = isFastTyper || (charsTyped > 10 && charsPerSecond > 6);

    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      startedTypingAt = null;
      isFastTyper = false;
      charsTyped = 0;
    }, 1200);
  }
</script>

<div class="contentpadding">
  <h1>Contribute</h1>
  <!-- svelte-ignore component-name-lowercase -->
  <form on:submit="{sendContribution}" class="lurinForm">
    <div>
      <label for="contributor">Contributor</label>
      <input
        type="text"
        name="contributor"
        on:keyup="{speedCheck}"
        bind:value="{factObj.contributor}"
      />
    </div>
    <br />
    <div>
      <label for="fact">Fact</label>
      <textarea
        name="fact"
        cols="40"
        rows="5"
        bind:value="{factObj.fact}"
        on:keyup="{speedCheck}"></textarea>
      {factObj.fact.length} / 150
    </div>

    <div id="typeInfo">
      {#if startedTypingAt}
        {#if isFastTyper}
          <span>Ok that's fast now, but Lurin is still faster.</span>
        {:else}
          <span>Lurin types faster than you (just sayin')</span>
        {/if}
      {/if}
    </div>

    <Button
      disabled="{!$contributeForm.valid || factObj.fact.length == 0}"
      variant="raised"
      class="formButton"
    >
      <Label>Send</Label>
    </Button>
  </form>
</div>

<style type="text/postcss">
  #typeInfo > span {
    border: 1px solid #000;
    padding: 5px;
    margin: 10px auto;
    background-color: #e9ff0066;
  }
  #typeInfo {
    padding-top: 20px;
  }
</style>
