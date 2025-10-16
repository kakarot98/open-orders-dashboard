# Open Orders Dashboard

This project shows open order depth (buy/sell) and fill volume data together on a single chart.  
It uses a Rust backend that serves mock data and a Next.js frontend that plots it with Recharts.

---

## Project structure
```
.
├── backend/         # Rust server (provided)
├── frontend/        # Next.js + TypeScript + Tailwind app
└── README.md
```

---

## Setup instructions

### 1. Run the backend provided by company
The backend exposes `/depth` and `/fill` endpoints. Start docker desktop and then bash in backend > curly-parakeet

**Requirements:** Docker

```bash
cd backend
cd curly-parakeet
docker compose build server
docker compose server up
```
Runs on **http://localhost:3000**.

---

### 2. Run the frontend
The frontend will run on a differnt port than backend 

**Requirements:** Node.js ≥ 18 and npm

```bash
cd frontend
npm install
npm run dev -- -p 3001
```
Then visit **http://localhost:3001** (or the port Next.js shows).  
Make sure the backend is running first.

---

## What this does

- The dashboard fetches data from both `/depth` and `/fill`.
- Depth (buy/sell) is drawn as blue and red lines.
- Fill volume is shown as gray bars behind them.
- Both datasets are merged into 60-seconds buckets so that the timestamps line up.

---

## Assumptions

- You already possess the backend files
- Depth data updates roughly every few seconds. I only keep the **latest** snapshot per bucket since it represents the current state.
- Fill data is **summed** or **accumulated** per bucket to show total traded quantity.
- Each bucket represents **60 seconds**. This can be changed according to the requirements
- No artificial data is created for missing timestamps.

---

## Responsiveness

- Layout is built with TailwindCSS utilities.  
- The chart resizes automatically using `ResponsiveContainer` from Recharts.  
- Font size, axis spacing, and margins adjust for smaller screens.

---

## Tools used

- **Next.js + TypeScript** – frontend framework  
- **TailwindCSS** – styling  
- **Recharts** – chart rendering  
- **Rust** – mock API backend  

---

## How to check

When both servers are running:
- Visit the frontend in your browser.
- You should see two lines (buy/sell) and faint bars (fill volume).
- Hover over the chart to see time and values in tooltips.

---

This project was made for the open orders dashboard take‑home test.
