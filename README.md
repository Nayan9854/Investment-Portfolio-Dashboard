# Investment Portfolio Dashboard

A full-stack dynamic investment portfolio dashboard built with Next.js, TypeScript, Tailwind CSS, Node.js and Express.

The dashboard displays portfolio holdings, investment allocation, current market price (CMP), present value, gain/loss, P/E ratio and latest earnings. Market data is fetched from Yahoo Finance and Google Finance using unofficial/publicly accessible endpoints because official public APIs for the required data are not available.

## Live Demo

Frontend:
https://investment-portfolio-dashboard-blush.vercel.app/

Backend API:
https://investment-portfolio-api-fd8e.onrender.com/

GitHub:
https://github.com/Nayan9854/Investment-Portfolio-Dashboard

## Features

- Dynamic portfolio dashboard
- 26 portfolio holdings
- Portfolio grouped by sector
- Total investment calculation
- Present portfolio value calculation
- Gain/loss calculation
- Portfolio allocation percentage
- Current Market Price (CMP)
- P/E ratio
- Latest earnings
- Green/red gain-loss indicators
- Automatic data refresh every 15 seconds
- Last updated timestamp
- Sector-level investment, present value and gain/loss summaries
- Responsive layout
- Backend API for portfolio and market data
- Yahoo Finance market-price integration
- Google Finance P/E and earnings extraction
- Google Finance response caching
- Error handling for external data requests

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- CORS

### Data Sources

- Yahoo Finance - CMP
- Google Finance - P/E ratio and latest earnings

### Deployment

- Vercel - Frontend
- Render - Backend

## Project Structure

```text
portfolio-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── portfolio.ts
│   │   ├── services/
│   │   │   ├── googleFinance.ts
│   │   │   └── yahooFinance.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── data/
│   │   └── portfolio.ts
│   ├── types/
│   │   └── portfolio.ts
│   └── utils/
│       └── calculations.ts
│
└── README.md


