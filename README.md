# Earth Explorer

This project demonstrates the integration of GPT-4 and React-Leaflet to visualize geographic data. The app fetches coordinates and a location title from GPT-4 based on a user query, and then renders them as markers on a Leaflet map.

## Table of Contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Demo Video](#demo-video)

## Introduction

The application utilizes GPT-4 for generating coordinates and a title for a location based on the user's request. Once the information is fetched, React-Leaflet is used to mark that location on the map.

## Technologies
- OpenAI SDK
- Next.js
- React.js
- React-Leaflet
- Node.js

## Installation

1. Install dependencies
```
pnpm install
```
2. Create `.env` file
```
cp .env.example .env
```
3. Add your OpenAI API key to a `.env` file
```
OPENAI_API_KEY=your-api-key-here
```
4. Start the development server
```
pnpm dev
```

## Usage
1. Open the application in a browser.
2. Enter a query in the input field.
3. Hit "Submit" or press Enter to get the coordinates and title which will be displayed on the map.
