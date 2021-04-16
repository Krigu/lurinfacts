import { makeRequest } from "./httpRequestService";

let baseUrl = "https://nominatim.openstreetmap.org/search?format=json&limit=3";
export async function getPositionByCoords(lat, lng) {
  var geoUrl = baseUrl + "&q=" + lat + "," + lng;
  return geoCodeService(geoUrl);
}

export async function getPositionByAddress(address) {
  var location = geoCodeService(baseUrl + "&q=" + address);
  return location;
}

async function geoCodeService(geoUrl) {
  let data = await makeRequest(geoUrl);
  let json = JSON.parse(data.responseText);

  console.log(json);
  if (json.length > 0) {
    var res0 = json[0];
    var addressParts = res0.display_name.split(',');
    var location = {
      latitude: res0.lat,
      longitude: res0.lon,
      address: res0.display_name,
      country: addressParts[addressParts.length - 1],
    };
    return location;
  }
  return null;
}
