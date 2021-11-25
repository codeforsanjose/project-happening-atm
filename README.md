[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# proj-happening-atm

It's common for city council, planning and commision meetings to only list one start time. The agenda items aren't scheduled for specific times because they do not know how long it will take to discuss each item. This leaves attendees wondering when they'll be able to comment on the agenda item they're interested in.

This problem has become a growing issue in the era of COVID-19 since virtual meetings are becoming more common. This web app allows meeting participants to "subscribe" to meeting items for notifications via text or email. Participants will benefit greatly from a notification system rather than be on stand-by for an undetermined length of time.

The City of San Jose is interested in this service, but this is a project that can scale to other cities as well.

# Tech Stack

- Frontend
  - React.js + hooks
  - SASS
- Backend
  - [Node.js and npm](https://www.npmjs.com/get-npm)
  - [GraphQL](https://graphql.org/learn/) for backend.
  - [Apollo](https://www.apollographql.com/docs/) for backend.
  - [Postgres](https://wiki.postgresql.org/wiki/Homebrew) / [AWS RDS](https://aws.amazon.com/rds/) for database.
  - [AWS S3](https://aws.amazon.com/s3/)
  - [Twilio](https://www.twilio.com/docs) for sending SMS.
  - [AWS SES](https://aws.amazon.com/s3/) for sending emails.
  - [Docker](https://www.docker.com/products/docker-desktop) to bring up development environment.

# Resources

- Slack Channel: #proj-happening-atm-eng
- [Google Drive](https://drive.google.com/drive/folders/1a89AKh3Kia3BGYeMUF7ishE4avblFIYu?usp=sharing)
- [Links to Visual Design Mocks](https://docs.google.com/document/d/1Jcdsw6d8MMXWaU_PTPcMVtoTtBxtx4A7d0VfhMH7K5M/edit)
- [Latest Kanban ToDo list](https://trello.com/b/pfECjOgE/happening-atm)
- [(old) List of TODO items](https://github.com/codeforsanjose/gov-agenda-notifier/projects/2)

- [User Stories Board](https://miro.com/app/board/o9J_leAd8y8=/)

# Setup

There are two ways to setup for local developemnt, with docker-compose (option 1) or directly (option 2). Option 1 is the recommened way to get started. It will bring up the app with a single docker command.

## Option 1

When running with docker-compose, a separate persistent volume is created for PostgreSQL. Also, changes made from your local text editor is synced to the respective containers for auto restart.

1. Go to the issues page to find something to work on:
   - https://github.com/codeforsanjose/gov-agenda-notifier/issues
1. Install Docker: https://www.docker.com/products/docker-desktop
1. Create a `.env` file in the `/backend/graphql_api/lambda` and paste the following in that file without changing anything (you don't need the values to get started):

   ```
   NODE_ENV=development

   PGHOST=gov-agenda-notifier_backend_pg_1
   PGUSER=docker
   PGPASSWORD=docker
   PGDATABASE=devdb
   PGPORT=5432

   TWILIO_ACCOUNT_SID=AC-THIS-IS-TOP-SECRET-AND-NEEDS-TO-START-WITH-AC
   TWILIO_AUTH_TOKEN=THIS-IS-TOP-SECRET
   TWILIO_PHONE_NUMBER=THIS-IS-TOP-SECRET
   SEND_TEXT=false

   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_DEFAULT_REGION=
   FROM_ADDRESS=
   SEND_EMAIL=false

   JWT_SECRET=NEED-TO_CREATE-SECRET-KEY
   JWT_ISSUER=ADD-ISSUER-DOMAIN
   JWT_AUDIENCE=ADD-AUDIENCE

   GOOGLE_CLIENT_ID=NEED-TO-REGISTER-APP
   GOOGLE_CLIENT_SECRET=NEED-TO-REGISTER-APP
   ```

   - This file is NOT to be included in version control. We don't want secret keys publicly accessible.

1. Create a `.env` file in the `backend/agenda_upload_service/lambda` and paste the following in that file without changing anything (you don't need the values to get started):

   ```
   NODE_ENV=development

   PGHOST=gov-agenda-notifier_backend_pg_1
   PGUSER=docker
   PGPASSWORD=docker
   PGDATABASE=devdb
   PGPORT=5432

   ```

1. Run docker-compose command to bring up the apps:
   ```bash
   docker-compose -p gov-agenda-notifier up --build
   ```
1. View the GraphQL API playground at http://localhost:3000/graphql
1. View the app at http://localhost:3001
1. Run command to remove (most) of build artifacts:
   ```bash
   docker-compose -p gov-agenda-notifier down --remove-orphans
   ```

## Option 2

This method is deprecated as of 4/21 and will soon be removed. Please use Option 1.

### To Begin Work on the Frontend / Serve Frontend

1. Install [Node.js and npm](https://www.npmjs.com/get-npm)
1. Install project dependencies:
   1. Please disable any linting or formatting solutions you have running globally. We enforce the Airbnb style guide with ESLint.
   1. Navigate to the `/frontend` directory
   1. Run command:
      ```bash
      npm install
      ```
   1. ESLint should be running as soon as you open a file with VS Code.
1. Make modifications to the codebase to address the issue your working on
1. See your changes:
   1. Navigate to the `/frontend` directory
   1. Run command:
      ```bash
      npm start
      ```

### To Begin Work on the Backend / Serve Backend

Frontend specific development doesn't require these steps. Setting up the DB is only necessary if you'll be wanting to interact with the entire web app, including the backend API.

1. Visit the issues page to find something to work on:
   - https://github.com/codeforsanjose/gov-agenda-notifier/issues
2. Initialize the local DB
   - This step requires the `make` utility.
     - Additional configuration for this is required on [Windows](https://vispud.blogspot.com/2019/02/how-to-run-makefile-in-windows.html)
   1. Install [Docker](https://www.docker.com/products/docker-desktop)
   2. Create the Docker image for the local DB
      - This only needs to be done once unless modifcations have been made to `/backend/docker_for_local_dev_db/init.sql`. See notes below.
      1. Navigate to `/backend/docker_for_local_dev_db`
      2. Run command:
         ```bash
         make image
         ```
   3. Spin up a corresponding Docker container ("Turn it on")
      1. Navigate to `/backend/docker_for_local_dev_db`
      2. Run command:
         ```bash
         make container
         ```
3. Initialize the GraphQL API Lambda server locally

   1. Create a `.env` file in the `/backend/graphql_api/lambda` directory

         ```
         NODE_ENV=development

         PGHOST=127.0.0.1
         PGUSER=docker
         PGPASSWORD=docker
         PGDATABASE=devdb
         PGPORT=8888

         TWILIO_ACCOUNT_SID=AC-THIS-IS-TOP-SECRET-AND-NEEDS-TO-START-WITH-AC
         TWILIO_AUTH_TOKEN=THIS-IS-TOP-SECRET
         TWILIO_PHONE_NUMBER=THIS-IS-TOP-SECRET
         SEND_TEXT=false

         AWS_ACCESS_KEY_ID=
         AWS_SECRET_ACCESS_KEY=
         AWS_DEFAULT_REGION=
         FROM_ADDRESS=
         SEND_EMAIL=false

         JWT_SECRET = NEED-TO_CREATE-SECRET-KEY
         JWT_ISSUER = ADD-ISSUER-DOMAIN
         JWT_AUDIENCE = ADD-AUDIENCE

         GOOGLE_CLIENT_ID = NEED-TO-REGISTER-APP
         GOOGLE_CLIENT_SECRET = NEED-TO-REGISTER-APP
         ```

         - This file is NOT to be included in version control. We don't want secret keys publicly accessible.

   2. Install project dependencies:
      1. Navigate to the `/backend/graphql_api/lambda` directory
      2. Run command:
         ```bash
         npm install
         ```
   3. Start server:
      1. Navigate to the `/backend/graphql_api/lambda` directory
      2. Run command:
         ```bash
         npm start
         ```
   4. View the GraphQL API playground at http://localhost:3000/graphql

4. Make modifications to the codebase to address the issue you're working on

### Local Dev Notes:

If changes are made to `/backend/docker_for_local_dev_db/init.sql`, the old docker image must be deleted, regenerated and containerized for the changes to take place.

The command for deleting the previous image is:

```bash
make rm-image
```

After deleting the image with that command, follow steps "2. Initialize the local DB" again for your local DB to be back up and running.

# Architecture

Frontend and backend are their own services. Frontend is in React and can be found in `frontend/` folder. To fetch data, frontend makes http requests to the backend using Graphql. Backend can be found in `backend/graphql_api/lambda` folder.

Upload is its own express app and can be found in `backend/agenda_upload_service/`. The upload services will be brought up by docker-compose along with the other services. To upload, use the example file (`backend/agenda_upload_service/example.csv`), then do:

    curl --form csvfile='@backend/agenda_upload_service/example.csv' -F csvfile=example.csv localhost:3002/upload

Graphql requires you to write resolvers (`backend/graphql_api/lambda/graphql/resolvers`) which once registered can be called by the frontend. There's `backend/graphql_api/lambda/db/dbClient.js` which is used by the resolvers to connect to the database.

## Migrations

`postgres-migrations` library is used to manage migrations. `backend/graphql_api/lambda/migrations/` contains all the migrations with the exception of creating the database which still exists in `backend/docker_for_local_dev_db/init.sql`.

Migrations are run on each request in `backend/graphql_api/lambda/db/dbClient.js`.

To create a new migration:

1. Create a new file in `backend/graphql_api/lambda/migrations/` with incrementing integer prefix and few words describing the change, for example `002-add-link-to-meeting.sql`.
1. Add your migration in that file.
1. Migrations will be automatically run on next request to the backend.

When adding or updating fields that are used in the Graphql mutations, be sure to update `backend/graphql_api/lambda/graphql/apolloServer.js`.

# Workflow

1. Go to the issues page to find something to work on: https://github.com/codeforsanjose/gov-agenda-notifier/issues. If you're not sure, ping #proj-happening-atm-eng in slack for help.
1. Create a branch off `develop` and make your commits.
1. Open a PR to `develop` branch. Once merged, it'll autodeploy to the staging environment.
1. To deploy to production, open a PR from `develop` to `main` branch. Once merged, it'll autodeploy to the production environment.

NOTE: Do NOT open PRs directly to `main` branch without merging it in develop. If you want to deploy a specific commit to branch, you can do so, but open another PR to the `develop` branch so the two branches don't diverge.

# Deploy

We are using Code for San Jose AWS account to deploy the app to staging and production urls. See `.github/workflows/aws.yml` for worflow. All the logic for bringing up the apps resides in the Code For San Jose terraform repo. The only exception are the Dockerfile in each of the services. This way we don't have to do any devops for this app and can rely on Code for San Jose's infrastructure.

Staging url can be found at https://happening-atm-stage.codeforsanjose.org. Production is at TODO.

# Help

If you run into issues getting the above app to work, please post to Slack `#proj-happening-atm-eng` with a detailed bug report. If you have trouble running docker/docker-compose, please paste the results of `docker-compose -p gov-agenda-notifier down --remove-orphans` with your bug report.
