# Marketing Unified Data Model

The purpose of this application is to provide a framework to generate transformations and mapping rules that allow you to standardize and unify different data models into a known data-model that can be used to aggregate data and generate a single source of truth of your marketing campaing data.

## Snowflake Container Services deployment

Steb by step installation is available in the [deployment notebook](/deployment.ipynb). Follow the instructions to get the container app deployed in your snowflake account.

There is a startup sql script [code_stage/setup.sql](code_stage/setup.sql) which is run after the app is deployed.

## Run and test the application locally

### Backend API

1. Follow the steps in the [backend/README.md](backend/README.md) to setup the environment
2. The API can be run with either the command line or VSCode debugguer as specified by the [README](backend/README.md)

### Frontend

1. Install the dependencies with `yarn --cwd frontend install`
2. Start the frontend aplication using `yarn --cwd frontend start`

## Docker

The application can also be run locally using Docker

1. For the node dependencies run `yarn --cwd frontend install`
2. Build the frontend package using webpack `yarn --cwd frontend wp:build`
3. Build the docker image `docker build -t webapp .`
4. Fill in your credentials in the [.env](.env) file
5. Run docker app `docker run --rm -p 3000:3000 --env-file .env --name marketing-data-foundation webapp`
