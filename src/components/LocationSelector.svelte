<script>
  import { onMount } from "svelte";
  import {
    getPositionByCoords,
    getPositionByAddress,
  } from "./../services/geoLocationService.js";
  import Button, { Label } from "@smui/button";
  import Radio from "@smui/radio";
  import FormField from "@smui/form-field";
  import { Icon } from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";
  import { notify } from "./../services/notifyService.js";

  const dispatch = createEventDispatcher();

  export let location = {};

  let map;
  let mapElement;
  let marker = {};
  let selectedOption = "map";
  let addressSearch = "";
  function initMap() {
    let initialCoords = [46.65, 7.709];

    if (location && location.latitude) {
      initialCoords = [location.latitude, location.longitude];
    } else {
      updateLocationByCoords(initialCoords[0], initialCoords[1]);
    }

    map = L.map("map").setView(initialCoords, 6);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "OSM",
    }).addTo(map);

    marker = L.marker(initialCoords, { draggable: true }).addTo(map);
    marker.on("dragend", function () {
      var latLng = marker.getLatLng();
      //console.log("moved marker", latLng);
      updateLocationByCoords(latLng.lat, latLng.lng);
    });
  }

  async function updateLocationByCoords(lat, lng) {
    try {
      let foundLocation = await getPositionByCoords(lat, lng);
      if (foundLocation == null) {
        notify("could not get location by coordinates.");
      } else {
        setLocation(foundLocation);
      }
    } catch (e) {
      console.log("updateLocationByCoords: error while looking up coords", e);
    }
  }
  async function getByAddress(e) {
    e.preventDefault();
    try {
      let foundLocation = await getPositionByAddress(addressSearch);
      if (foundLocation == null) {
        notify("could not get location by address.");
      } else {
        setLocation(foundLocation);
      }
    } catch (e) {
      console.log("getByAddress: error while looking up coords", e);
    }
    return false;
  }

  function setLocation(newLocation) {
    location = newLocation;
    marker.setLatLng([newLocation.latitude, newLocation.longitude]);
    dispatch("locationChoosen", location);
  }

  onMount(async () => {
    optionChanged();
  });

  let locationOfDevice = {};
  function optionChanged() {
    if (selectedOption == "map") {
      initMap();
    } else if (selectedOption == "device") {
      locationOfDevice = {
        msg: "Locate your device position.....",
        icon: "phonelink_ring",
      };
      if (!navigator.geolocation) {
        locationOfDevice = {
          msg: "Looks like your phone does not support gelocation",
          icon: "local_phone",
        };
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationOfDevice = { msg: "Location found", icon: "done" };
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          updateLocationByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          if (error.code == 1) {
            locationOfDevice = {
              msg: "Error on fetching the device's locaction",
              icon: "phonelink_erase",
            };
          } else {
            locationOfDevice = {
              msg: "Lurin has no rights to access your device's location 💩",
              icon: "phonelink_lock",
            };
          }
        }
      );
    }
  }
</script>

<div>
  <h2>Add location</h2>
  <div>
    <FormField>
      <Radio
        bind:group="{selectedOption}"
        value="address"
        on:change="{optionChanged}"
      />
      <span slot="label">By address</span>
    </FormField>
    <FormField>
      <Radio
        bind:group="{selectedOption}"
        value="map"
        on:change="{optionChanged}"
      />
      <span slot="label">By map location</span>
    </FormField>
    <FormField>
      <Radio
        bind:group="{selectedOption}"
        value="device"
        on:change="{optionChanged}"
      />
      <span slot="label">Device location</span>
    </FormField>
  </div>

  {#if selectedOption == "address"}
    <div>
      <h3>Choose by address</h3>
      <div class="lurinForm">
        <label for="contributor">Address</label>
        <input type="text" name="contributor" bind:value="{addressSearch}" />
        Where have you been? Enter a address, Lurin will guess the coordinates.
      </div>
      <div style="width: 100%;height: 80px;">
        <Button on:click="{getByAddress}" variant="raised" class="formButton">
          <Label>Get coords by address</Label>
        </Button>
      </div>
    </div>
  {:else if selectedOption == "device"}
    <div>
      <h3>Choose by device</h3>
      <Icon class="material-icons" style="vertical-align: text-bottom">
        {locationOfDevice.icon}
      </Icon>
      <span>{locationOfDevice.msg}</span>
    </div>
  {:else if selectedOption == "map"}
    <div>
      <h3>Choose by map</h3>
      <div id="map"></div>
    </div>
  {/if}

  {#if location && location.address}
    <h3>Choosen location</h3>
    Latitdude: {location.latitude}
    <br />
    Longitude: {location.longitude}
    <br />
    Address: {location.address}
    <br />
    Country: {location.country}
    <br />
  {/if}
</div>

<style type="text/postcss">
  #map {
    height: 300px;
    width: 100%;
  }
</style>
