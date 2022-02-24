# Filmyfy
University project for subject PA181 Services - Systems, Modeling and Execution

Docs: https://docs.google.com/document/d/1g2go1YOSoH3JypsS6OBfaQZX2-_LdatsuZuNj8-GmIs/edit?usp=sharing
Presentation: https://www.youtube.com/watch?v=50Qn5M3iT9c

## Project description

<img width="829" alt="Screenshot 2022-02-24 at 9 43 13" src="https://user-images.githubusercontent.com/26143964/155489433-2a13d80c-1fc5-4d04-90ed-7a2a167b3476.png">

The goal of the project is to fetch movie metadata from the [TMDB](https://www.themoviedb.org/) public API and display recommended movie to every user based on his/her previous watching history. Frontend React app is communicating with our Flask backened server via TMDB Api where are movie data collected. Whole app is deployed in IBM Cloudant.

## Technologie:
- __BACKEND__: Flask, NoSQL Cloudant
- __FRONTEND__: React, Material-UI

## Development
To run the backend locally run:
```
python3 app.py
```

Frontend can be started as follows:
```
yarn
```
```
yarn start
```
