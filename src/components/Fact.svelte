<script>
  import { createEventDispatcher } from "svelte";
  import { getDisplayTime } from "../services/displayTime.js";
  import Card from "@smui/card";
  import Button, { Label } from "@smui/button";

  export let fact;
  export let hasDeleteButton;
  export let hasAcceptButton;

  const dispatch = createEventDispatcher();

  function deleteFact(e) {
    e.stopPropagation();
    dispatch("delete", { fact });
  }
  function acceptFact(e) {
    e.stopPropagation();
    dispatch("accept", { fact });
  }
</script>

<style>
  .factContainer {
    width: 100%;
  }

  .factSubtitle {
    font-size: 12px;
    text-align: right;
    padding-top: 4px;
  }
  @media (prefers-color-scheme: dark) {
    .factContainer {
      color: black;
    }
  }
</style>

<div style="display: flex; flex-wrap: wrap;width:100%">
  <div class="card-container short factContainer">
    <Card style="background-color: #ffff65;" padded>
      {fact.fact}
      <div class="factSubtitle">
        {getDisplayTime(fact.insertTime)} | by {fact.contributor}
      </div>
    </Card>
    {#if hasDeleteButton}
      <Button on:click={deleteFact} variant="raised" class="formButton">
        <Label>Delete fact</Label>
      </Button>
    {/if}
    {#if hasAcceptButton}
      <Button on:click={acceptFact} variant="raised" class="formButton">
        <Label>Accept fact</Label>
      </Button>
    {/if}
  </div>
</div>
