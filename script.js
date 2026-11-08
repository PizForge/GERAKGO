const $ = (id) => document.getElementById(id);
const fmt = (n) => "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (id) => Math.max(0, parseFloat($(id).value) || 0);
const fmtL = (n) => n.toLocaleString("en-MY", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const peopleLabel = (n) => `${n} ${n === 1 ? "person" : "people"}`;

let shareText = "";
let savedTollValue;
let savedParkingValue;

function calculate() {
  const trips = $("round").checked ? 2 : 1;
  const people = Math.max(1, Math.round(num("people")));
  const isMotorcycle = $("vehicleType").value === "motorcycle";
  const tollInput = $("toll");
  const parkingInput = $("parking");
  if (isMotorcycle) {
    if (!tollInput.disabled) savedTollValue = tollInput.value;
    if (!parkingInput.disabled) savedParkingValue = parkingInput.value;
    tollInput.value = "0";
    parkingInput.value = "0";
    tollInput.disabled = true;
    parkingInput.disabled = true;
    $("freeNote").textContent = "Motorcycles: no toll and no parking charge";
  } else {
    if (tollInput.disabled) {
      tollInput.disabled = false;
      tollInput.value = savedTollValue === undefined ? "0" : savedTollValue;
      savedTollValue = undefined;
    }
    if (parkingInput.disabled) {
      parkingInput.disabled = false;
      parkingInput.value = savedParkingValue === undefined ? "0" : savedParkingValue;
      savedParkingValue = undefined;
    }
    $("freeNote").textContent = "";
  }
  const km = num("distance") * trips;

  const fuel = (km * num("cons") / 100) * num("fuel");
  const toll = isMotorcycle ? 0 : num("toll") * trips;
  const parking = isMotorcycle ? 0 : num("parking");
  const wear = km * num("wear");
  const total = fuel + toll + parking + wear;
  const perPerson = total / people;

  const vehicleName = $("vehicle").value.trim() || "Vehicle";
  const tank = num("tank");
  const litres = km * num("cons") / 100;
  const range = tank > 0 && num("cons") > 0 ? tank / num("cons") * 100 : 0;

  const altPerPerson = (num("altFare") * trips) + num("altExtra");
  const altName = $("altName").value.trim() || "Alternative";

  const from = $("from").value.trim();
  const to = $("to").value.trim();
  const route = from && to ? `${from} → ${to}${trips === 2 ? " (round trip)" : ""}` : "Your trip";

  $("route").textContent = route;
  $("perPerson").textContent = fmt(perPerson);
  $("rFuel").textContent = fmt(fuel);
  $("rToll").textContent = fmt(toll);
  $("rPark").textContent = fmt(parking);
  $("rWear").textContent = fmt(wear);
  $("rTotal").textContent = fmt(total);
  $("rLitres").textContent = tank > 0 ? `${fmtL(litres)} L (${fmtL(litres / tank)} tanks)` : `${fmtL(litres)} L`;
  $("rRange").textContent = range > 0 ? `${Math.round(range)} km` : "-";
  $("rangeNote").textContent = range > 0 && km > range
    ? `The full trip is ${Math.round(km)} km but one tank lasts about ${Math.round(range)} km. Plan to refuel along the way.`
    : "";

  $("altLabel").textContent = altName;
  $("carLabel").textContent = vehicleName;
  $("valCar").textContent = fmt(perPerson);
  $("valAlt").textContent = fmt(altPerPerson);
  const max = Math.max(perPerson, altPerPerson, 1);
  $("barCar").style.width = (perPerson / max * 100) + "%";
  $("barAlt").style.width = (altPerPerson / max * 100) + "%";

  const diff = Math.abs(perPerson - altPerPerson);
  const verdictText = $("verdictText");
  if (diff < 0.5) {
    verdictText.textContent = "The cost is nearly the same. Choose based on comfort and travel time.";
  } else if (perPerson < altPerPerson) {
    verdictText.replaceChildren(
      document.createTextNode("Driving is "),
      Object.assign(document.createElement("strong"), { className: "saving-amount", textContent: fmt(diff) }),
      document.createTextNode(` cheaper per person than ${altName} with ${peopleLabel(people)} in the vehicle.`)
    );
  } else {
    const neededPassengers = Math.ceil(total / Math.max(altPerPerson, 0.01));
    verdictText.replaceChildren(
      document.createTextNode(`${altName} is `),
      Object.assign(document.createElement("strong"), { className: "saving-amount", textContent: fmt(diff) }),
      document.createTextNode(` cheaper per person. With ${peopleLabel(people)}, the vehicle needs at least ${neededPassengers} ${neededPassengers === 1 ? "passenger" : "passengers"} to match this price.`)
    );
  }

  shareText = `${route}\nVehicle: ${vehicleName}\nDistance: ${km} km\nFuel ${fmt(fuel)} | Tolls ${fmt(toll)} | Parking ${fmt(parking)}\nTotal ${fmt(total)} (${fmt(perPerson)} per person for ${peopleLabel(people)})\n${altName}: ${fmt(altPerPerson)} per person\nCalculated with GerakGo`;
}

// Popular vehicles in Malaysia. Tank in litres, cons in L/100 km.
// These are estimates: real fuel use depends on driving style and condition.
const VEHICLES = {
  "Perodua Axia":      { tank: 33, cons: 5.0, type: "car" },
  "Perodua Myvi":      { tank: 36, cons: 6.0, type: "car" },
  "Perodua Bezza":     { tank: 36, cons: 5.5, type: "car" },
  "Perodua Ativa":     { tank: 36, cons: 5.5, type: "car" },
  "Perodua Aruz":      { tank: 45, cons: 7.5, type: "car" },
  "Proton Saga":       { tank: 40, cons: 6.5, type: "car" },
  "Proton Persona":    { tank: 40, cons: 6.5, type: "car" },
  "Proton Iriz":       { tank: 40, cons: 6.5, type: "car" },
  "Proton X50":        { tank: 45, cons: 7.0, type: "car" },
  "Toyota Vios":       { tank: 42, cons: 6.5, type: "car" },
  "Honda City":        { tank: 40, cons: 6.0, type: "car" },
  "Toyota Hilux":      { tank: 80, cons: 9.0, type: "car" },
  "Honda EX5":         { tank: 4.2, cons: 2.0, type: "motorcycle" },
  "Yamaha Y15ZR":      { tank: 4.2, cons: 2.5, type: "motorcycle" },
  "Yamaha LC135":      { tank: 4.1, cons: 2.5, type: "motorcycle" },
  "Honda RS150R":      { tank: 4.0, cons: 2.5, type: "motorcycle" },
  "Honda Vario 150":   { tank: 5.5, cons: 2.2, type: "motorcycle" },
  "Yamaha NMax 155":   { tank: 7.1, cons: 2.3, type: "motorcycle" },
};

const vehicleList = $("vehicleList");
Object.entries(VEHICLES).forEach(([name, v]) => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.label = `${v.tank} L tank, ${v.cons} L/100 km`;
  vehicleList.appendChild(opt);
});

$("vehicle").addEventListener("input", () => {
  const typed = $("vehicle").value.trim().toLowerCase();
  const match = Object.keys(VEHICLES).find((name) => name.toLowerCase() === typed);
  if (match) {
    $("tank").value = VEHICLES[match].tank;
    $("cons").value = VEHICLES[match].cons;
    $("vehicleType").value = VEHICLES[match].type;
    $("cons").dispatchEvent(new Event("input", { bubbles: true }));
  }
});

const vehicleInput = $("vehicle");
let previousVehicle = "";

const showFullList = () => {
  if (vehicleInput.value) {
    previousVehicle = vehicleInput.value;
    vehicleInput.value = "";
  }
};

vehicleInput.addEventListener("focus", showFullList);
vehicleInput.addEventListener("mousedown", showFullList);
vehicleInput.addEventListener("blur", () => {
  if (vehicleInput.value === "" && previousVehicle) {
    vehicleInput.value = previousVehicle;
  }
  previousVehicle = "";
  calculate();
});

document.querySelectorAll("input").forEach((el) => el.addEventListener("input", calculate));
$("vehicleType").addEventListener("change", calculate);
$("vehicleSize").addEventListener("change", () => {
  if ($("vehicleSize").value) {
    $("cons").value = $("vehicleSize").value;
    $("cons").dispatchEvent(new Event("input", { bubbles: true }));
  }
});

$("useTankConsumption").addEventListener("click", () => {
  const litres = $("tankLitresFilled").valueAsNumber;
  const km = $("tankKmDriven").valueAsNumber;
  if (!Number.isFinite(litres) || !Number.isFinite(km) || litres <= 0 || km <= 0) {
    alert("Enter litres and kilometres greater than 0.");
    return;
  }

  $("cons").value = (litres / km * 100).toFixed(1);
  $("cons").dispatchEvent(new Event("input", { bubbles: true }));
});

$("autoDistance").addEventListener("click", async () => {
  const button = $("autoDistance");
  const from = $("from").value.trim();
  const to = $("to").value.trim();
  button.disabled = true;
  button.textContent = "Calculating...";

  try {
    const geocode = async (place) => {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.search = new URLSearchParams({
        format: "json",
        limit: "1",
        countrycodes: "my",
        q: place,
      }).toString();
      const response = await fetch(url);
      if (!response.ok) throw new Error("Geocoding request failed");
      const results = await response.json();
      if (!results.length) throw new Error("Place not found");
      return results[0];
    };

    if (!from || !to) throw new Error("Enter both places");
    const origin = await geocode(from);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const destination = await geocode(to);

    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
    const routeResponse = await fetch(routeUrl);
    if (!routeResponse.ok) throw new Error("Routing request failed");
    const routeData = await routeResponse.json();
    if (routeData.code !== "Ok" || !routeData.routes.length) {
      throw new Error("Route not found");
    }

    $("distance").value = Math.round(routeData.routes[0].distance / 1000);
    $("distance").dispatchEvent(new Event("input", { bubbles: true }));
  } catch {
    alert("Could not calculate the distance. Try another place name or enter km manually.");
  } finally {
    button.disabled = false;
    button.textContent = "Auto-fill distance";
  }
});

$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareText);
    $("copied").textContent = "Copied. Paste it into WhatsApp.";
  } catch {
    $("copied").textContent = "Could not copy. Select and copy the text manually.";
  }
});

calculate();
