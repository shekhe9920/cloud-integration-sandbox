# Cloud Integration Sandbox

A small learning project for TypeScript, API development, AWS, and AWS Lambda.

The project is currently a simple Weather API built with Express and TypeScript. It fetches weather data from Open-Meteo and includes tests for utilities, services, and routes.

## Learning Goals

- Practice TypeScript with strict settings
- Build a small Express API
- Write tests with Vitest and Supertest
- Mock external API calls
- Run CI with GitHub Actions
- Later: adapt or deploy the API with AWS Lambda

## Tech Stack

- Node.js
- TypeScript
- Express
- Vitest
- Supertest
- Open-Meteo API
- GitHub Actions

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

```text
GET /health
GET /weather/:city
GET /forecast/:city
```

Examples:

```text
http://localhost:3000/weather/oslo
http://localhost:3000/weather/oslo?unit=fahrenheit
http://localhost:3000/forecast/oslo
```

`unit` can be:

- `celsius`
- `fahrenheit`

If no `unit` is provided, the API uses `celsius`.

## Scripts

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run TypeScript type checking:

```bash
npm run typecheck
```
