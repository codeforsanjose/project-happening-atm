[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# gov-agenda-notifier

It's common for city council, planning and commision meetings to only list one start time. The agenda items aren't scheduled for specific times because they do not know how long it will take to discuss each item. This leaves attendees wondering when they'll be able to comment on the agenda item they're interested in.

This problem has become a growing issue in the era of COVID-19 since virtual meetings are becoming more common. This web app allows meeting participants to "subscribe" to meeting items for notifications via text or email. Participants will benefit greatly from a notification system rather than be on stand-by for an undetermined length of time.

The City of San Jose is interested in this service, but this is a project that can scale to other cities as well.

# Tech Stack

- Currently migrating deployed version to AWS
- Frontend
  - React.js + hooks
  - SASS
- Backend
  - [Node.js and npm](https://www.npmjs.com/get-npm)
  - [Docker](https://www.docker.com/products/docker-desktop)
  - [Postgres](https://wiki.postgresql.org/wiki/Homebrew)
  - [GraphQL](https://graphql.org/learn/)
  - [Apollo](https://www.apollographql.com/docs/)
  - [Twilio](https://www.twilio.com/docs)
  - [AWS Lambda](https://aws.amazon.com/lambda/)
  - [AWS API Gateway](https://aws.amazon.com/api-gateway/)
  - [AWS RDS](https://aws.amazon.com/rds/)
  - [AWS S3](https://aws.amazon.com/s3/)
  - [AWS Amplify](https://aws.amazon.com/amplify/)
  - [Terraform](https://www.terraform.io/)

# Resources

- Slack Channel: #csj-city-meeting-participation
- [Google Drive](https://drive.google.com/drive/folders/1LAloOcCLCf4Mi-ulkx1ofZw1iIip2T0s)
- [Links to Visual Design Mocks](https://docs.google.com/document/d/1bsBU2OwlY0_BJ48z_6H8GPl-vv0a86lvGEPuGZqgvGo/edit)
- [List of TODO items](https://github.com/codeforsanjose/gov-agenda-notifier/projects/2)

# Local Development

There are two ways to setup for local developemnt, with docker-compose (option 1) or directly (option 2).

## Option 1

When running with docker-compose, a separate persistent volume is created for PostgreSQL. Also, changes made from your local text editor is synced to the respective containers for auto restart.

1. Go to the issues page to find something to work on:
   - https://github.com/codeforsanjose/gov-agenda-notifier/issues
1. Install Docker: https://www.docker.com/products/docker-desktop
1. Create a `.env` file in the `/backend/graphql_api/lambda` directory
1. Make sure the file includes these keys:

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

   JWT_SECRET = NEED-TO_CREATE-SECRET-KEY
   JWT_ISSUER = ADD-ISSUER-DOMAIN
   JWT_AUDIENCE = ADD-AUDIENCE

   GOOGLE_CLIENT_ID = NEED-TO-REGISTER-APP
   GOOGLE_CLIENT_SECRET = NEED-TO-REGISTER-APP
   ```

   - This file is NOT to be included in version control. We don't want secret keys publicly accessible.
   - Message Trace Ohrt on Slack if you need secret keys

1. Create a `.env` file in the `backend/agenda_upload_service/lambda/` directory
1. Make sure the file includes these keys:

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

### To Begin Work on the Frontend / Serve Frontend

1. Go to the issues page to find something to work on:
   - https://github.com/codeforsanjose/gov-agenda-notifier/issues
2. Install [Node.js and npm](https://www.npmjs.com/get-npm)
3. Install project dependencies:
   1. Please disable any linting or formatting solutions you have running globally. We enforce the Airbnb style guide with ESLint.
   2. Navigate to the `/frontend` directory
   3. Run command:
      ```bash
      npm install
      ```
   4. ESLint should be running as soon as you open a file with VS Code.
4. Make modifications to the codebase to address the issue your working on
5. See your changes:
   1. Navigate to the `/frontend` directory
   2. Run command:
      ```bash
      npm start
      ```

## To Begin Work on the Backend / Serve Backend

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

      1. Make sure the file includes these keys:

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
         - Message Trace Ohrt on Slack if you need secret keys

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

### Migrations

`postgres-migrations` library is used to manage migrations. `backend/graphql_api/lambda/migrations/` contains all the migrations with the exception of creating the database which still exists in `backend/docker_for_local_dev_db/init.sql`.

Migrations are run on each request in `backend/graphql_api/lambda/db/dbClient.js`.

To create a new migration:

1. Create a new file in `backend/graphql_api/lambda/migrations/` with incrementing integer prefix and few words describing the change, for example `002-add-link-to-meeting.sql`.
2. Add your migration in that file.
3. Migrations will be automatically run on next request to the backend.

# Infrastructure

Ideally, deployments are automatically handled by the CI/CD pipeline. This section of documentation facilitates manual infrastructure management, if required.

## Local Configuration:

1.  Setup [AWS CLI](https://docs.aws.amazon.com/polly/latest/dg/setup-aws-cli.html)
2.  Install [Terraform](https://www.terraform.io/)
3.  `make` utility
    - Additional configuration to use `make` is required on [Windows](https://vispud.blogspot.com/2019/02/how-to-run-makefile-in-windows.html)

## Manual Deployment Management:

1.  Deploy infrastructure to AWS:
    1. Navigate to the `/infrastructure` directory
    2. Run command:
       ```bash
       make deploy
       ```
2.  Remove deployed infrastructure from AWS:
    1. Navigate to the `/infrastructure` directory
    2. Run command:
       ```bash
       make destroy
       ```
