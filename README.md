# RealRoot

RealRoot is a neighbourhood intelligence tool that helps people understand the true cost of living in Toronto — beyond just rent. It combines commute time, gentrification risk, and housing affordability into a single unified score.

## The Problem

Most people make housing decisions based on rent alone. They miss the hidden costs — transit expenses, time lost commuting, and the risk of being priced out of a neighbourhood within 12 to 18 months due to gentrification. RealRoot brings all of this together in one place.

## Features

- Neighbourhood analysis with a unified RealRoot Score out of 100
- Real commute time calculations using Google Maps Transit API
- Gentrification risk detection powered by IBM Watson Natural Language Understanding
- Statistics Canada census data including median income, population, and low-income rates
- City of Toronto Open Data including building permits and development applications
- Reverse budget calculator — enter a monthly budget and see which neighbourhoods you can afford
- Natural language input powered by IBM Watson NLU — describe your situation in plain English and the form fills automatically
- Neighbourhood comparison table ranked by score

## Data Sources

- Statistics Canada Census 2021 and CMHC Rental Market Reports
- City of Toronto Open Data Portal
- Google Maps Distance Matrix API
- IBM Watson Natural Language Understanding
- TTC transit fare data

## Tech Stack

- Frontend: React, Vite
- Backend: Python, Flask
- AI: IBM Watson NLU
- Mapping: Google Maps API
- Deployment: Vercel (frontend), Render (backend)

## Setup

### Backend
cd backend
pip install -r requirements.txt
python app.py

Create a `.env` file in the backend folder with your API keys:
WATSON_API_KEY=your_key
WATSON_URL=your_url
GOOGLE_MAPS_KEY=your_key

### Frontend
cd frontend
npm install
npm run dev

### UN Sustainable Development Goals
This project addresses SDG 11 (Sustainable Cities and Communities) and SDG 10 (Reduced Inequalities) by giving renters — particularly newcomers, students, and low-income individuals — access to housing intelligence that was previously only available to real estate professionals.

## Built For
IBM Z × UNSA Sheridan Hackathon 2026
