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

## Challenges Faced & Solutions

### 1. Yahoo Finance Rate Limiting

During deployment on Render, requests to Yahoo Finance initially returned HTTP 429 (Too Many Requests). This happened because Yahoo Finance was limiting automated requests.

**Solution:**  
I switched from the `yahoo-finance2` package to the Yahoo Finance chart endpoint and added appropriate request headers, including a browser-like User-Agent. This allowed the backend to retrieve the required market price data more reliably.

### 2. Google Finance Data Access

Google Finance does not provide an official public REST API for directly retrieving the required P/E ratio and latest earnings data.

**Solution:**  
I used publicly accessible Google Finance page data and extracted the required fields from the response. Since this data changes less frequently than market prices, I added an in-memory cache with a one-hour expiry to reduce unnecessary requests.

### 3. Different Stock Identifiers

The portfolio contained stocks listed on both NSE and BSE, while Yahoo Finance and Google Finance use different symbol formats.

**Solution:**  
I created separate Yahoo Finance and Google Finance symbols for each holding. This allowed the backend to request the appropriate data source format for each stock.

### 4. Keeping Calculations Separate

The dashboard requires several calculations such as investment, portfolio allocation, present value and gain/loss.

**Solution:**  
I separated these calculations into reusable TypeScript functions. This keeps the calculation logic independent from the UI and makes it easier to test and maintain.

### 5. Automatic Market Data Refresh

The dashboard needs to update market prices approximately every 15 seconds without requiring the user to manually refresh the page.

**Solution:**  
The frontend uses a timed refresh mechanism to request updated portfolio data from the backend every 15 seconds. The last successful update time is also displayed on the dashboard.

### 6. Handling External API Failures

External market-data sources can fail, return unexpected data, or become temporarily unavailable.

**Solution:**  
The backend validates responses and handles failed requests with appropriate errors. The backend validates responses and handles failed external requests with appropriate errors, allowing the application to handle external data failures more gracefully.

### 7. Deployment Configuration

The frontend and backend are deployed separately using Vercel and Render. The frontend needs to communicate with the production backend rather than the local development server.

**Solution:**  
I used an environment variable (`NEXT_PUBLIC_API_URL`) for the frontend API URL. This allows the same frontend code to work with the local backend during development and the deployed backend in production.
```
