# GerakGo

**Plan. Calculate. Go.**

GerakGo is a travel cost calculator for Malaysian road trips. Enter your route, vehicle and costs, and it shows what the trip really costs per person, then compares it with bus or train travel.

**Live demo:** https://USERNAME.github.io/gerakgo/

![GerakGo screenshot](screenshot.png)

## Features

- Calculates fuel, toll, parking and vehicle wear cost for one-way or round trips
- Splits the total cost by number of passengers
- Vehicle presets for popular Malaysian cars and motorcycles that fill in tank size and fuel use, or type your own vehicle
- Fuel needed in litres and tanks, range per full tank, and a warning when you need to refuel along the way
- Motorcycle mode with no toll and no parking charge
- Fuel price field set to the BUDI95 RON95 price, editable for other fuel prices
- Compares driving with an alternative such as ETS or bus, and shows which is cheaper
- One-click copy of the trip summary to share on WhatsApp
- Responsive layout with a dark navy and lime theme

## How to use

1. Enter where you are going and the one-way distance in km.
2. Choose your vehicle, or type your own, and check the tank size and fuel consumption (L/100 km).
3. Fill in the toll and parking costs. Tick **Round trip** if you are coming back.
4. Enter the alternative transport fare to compare.
5. Read the result, then copy and share it.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript (no frameworks, no build step)

## Run locally

Open `index.html` in a browser, or use the Live Server extension in VS Code.

## Project structure

```
gerakgo/
├── index.html
├── style.css
├── script.js
├── favicon.svg
└── README.md
```

## Notes

- Results are estimates. Real costs depend on traffic, driving style and vehicle condition.
- Fuel consumption and tank sizes for the listed vehicles are approximate. Check your owner's manual for your own figures.
- The default fuel price (RM1.99) is the BUDI95 price for RON95. Prices and eligibility can change, so check the latest information.

## Ideas for later

- Route presets with distance and toll already filled in
- Save favourite trips in the browser
- Fetch the latest weekly fuel price automatically

## Author

Built by USERNAME. Feedback and suggestions are welcome through GitHub issues.
