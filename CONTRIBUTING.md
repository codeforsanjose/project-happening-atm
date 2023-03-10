# Contributing to Happening ATM

## Join us on Slack! We also meet on Zoom weekly. (Details in README.md)

[Github Issues](https://github.com/codeforsanjose/project-happening-atm/issues) is a good place to start for identifying ways to contribute.
- Create a branch off `develop` and make your commits.
- Open a PR to `develop` branch. Once merged, it'll autodeploy to the staging environment.

## Software Architecture Overview

Frontend and backend are their own services. Frontend is in React and can be found in `frontend/` folder. To fetch data, frontend makes http requests to the backend using Graphql. Backend can be found in `backend/graphql_api` folder.

Upload is its own express app and can be found in `backend/agenda_upload_service/`. The upload services will be brought up by `docker compose` along with the other services. To upload, use the example file (`backend/agenda_upload_service/test_data/example.csv`), then do:
  ```
  curl --form csvfile='@backend/agenda_upload_service/test_data/example.csv' -F csvfile=test_data/example.csv localhost:3002/upload
  ```
Graphql requires you to write resolvers (`backend/graphql_api/graphql/resolvers`) which once registered can be called by the frontend. There's `backend/graphql_api/db/dbClient.js` which is used by the resolvers to connect to the database.

## Prerequisites

- Download and install Docker Desktop
  - https://www.docker.com/products/docker-desktop
  - :warning: Update if already installed.
- Additional prerequisites for Windows Users: https://docs.docker.com/desktop/install/windows-install/

## Initialize Development environment

:warning: All `docker compose` commands should be ran from repository root directory

1. Build all necessary Docker images
  ```
  docker compose build
  ```
2. Start the application
  ```
  docker compose up
  ```
3. Create Admin user for Graphql
  - TODO

#### Stop the application:
  - Ctrl-C
  - `docker compose down` in the repository root directory

#### Relavent Local URLs
- Frontend React App Server
  - `localhost:3001/`
- Graphql Server
  - `localhost:3000/graphql`
- Backend Node Server
  - `localhost:3002/`

## Migrations

`postgres-migrations` library is used to manage migrations. `backend/graphql_api/migrations/` contains all the migrations.
Migrations are run on each request in `backend/graphql_api/db/dbClient.js`.

To create a new migration:
- Create a new file in `backend/graphql_api/migrations/` with incrementing integer prefix and few words describing the change, for example `002-add-link-to-meeting.sql`.
- Add your migration in that file.
- Migrations will be automatically run on next request to the backend.

When adding or updating fields that are used in the Graphql mutations, be sure to update `backend/graphql_api/graphql/apolloServer.js`.

## FAQ / Help

- How are `node_modules` managed?
  - Utilizing Docker stages in `Dockerfiles`, `node_modules_cache` contains the "cached" `node_modules` directory.
- How to update `package.json` and/or `package-lock.json`
  - :info: Each "service" (frontend, backend, graphql) contains their own `package*.json`
  - For each service:
    - Comment out line `- /usr/src/app/node_modules` for the service
    - Run `docker compose run --rm ${SERVICE_NAME} npm install`
    - Uncomment `- /usr/src/app/node_modules`
    - :warning: Delete generated `node_modules` in that services' directory!
- Escape Hatch!
  - Unable to build or start the application; restart from a "clean slate"
  - Run `docker system prune -f -a --filter label='com.codeforsanjose.add=happening-atm'`
  - Still not working?
  - Run `docker system prune -a`

## External API Dependencies

:warning: **Managing Secrets**: `.env` is included in `.gitignore` to avoid leakage into Github. Although it is _ok_ to update the file with other secrets needed to run the application locally, please keep this in mind.

### Login using a Google Account

- To login with a Google account a Google API client ID must be provided to the front and backend.
- A Google API Client ID can be obtained by registering an APP here https://console.developers.google.com/.
- In the `.env` files located in `/backend/graphql_api` and `/frontend`, add the provided ID to the environment variables `GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_ID`.
- As an alternative the provided value in the `.env` file can be used for now.

### Login using a Microsoft Account

- To login with a Microsoft account a Microsoft API client ID must be provided to the front and backend.
- A Google API Client ID can be obtained by registering an APP here https://azure.microsoft.com/en-us/features/azure-portal/. Then search for Azure Active Directory. In the scroll bar on the left under manage select App registrations to register your App.
- In the `.env` file located in `/backend/graphql_api` and `/frontend`, add the provided ID to the environment variables `MICROSOFT_CLIENT_ID` and `REACT_APP_MICROSOFT_ID`.
- As an alternative the provided value in the `.env` file can be used for now.
   
### local account for local login.

- You should be able to use this site key in the `.env` file, if not you can create one by following the steps provided.
- You first need to create a key for the recaptcha at https://www.google.com/recaptcha/admin/create
- Select recaptcha v2
- Leave selection on "I'm not a robot" checkbox
- Add localhost as the domain.
- Accept terms of service.
- Submit
- copy site key.
- Add it to the environment variables `REACT_APP_RECAPTCHAS_SITE_KEY`.
