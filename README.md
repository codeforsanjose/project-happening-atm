[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
# gov-agenda-notifier
It's common for city council, planning and commision meetings to only list one start time. The agenda items aren't scheduled for specific times because they do not know how long it will take to discuss each item. This leaves attendees wondering when they'll be able to comment on the agenda item they're interested in.

This problem has become a growing issue in the era of COVID-19 since virtual meetings are becoming more common. This web app allows meeting participants to "subscribe" to meeting items for notifications via text or email. Participants will benefit greatly from a notification system rather than be on stand-by for an undetermined length of time.

The City of San Jose is interested in this service, but this is a project that can scale to other cities as well.

# Tech Stack
* Currently hosted for free on Heroku:
    * https://gov-agenda-notifier.herokuapp.com/
        *   This is just the frontend at the moment since DB hosting is more costly
* Frontend
    * React.js + hooks
    * SASS
* Backend
    * [Node.js and npm](https://www.npmjs.com/get-npm)
    * [Docker](https://www.docker.com/products/docker-desktop)
    * [Postgres](https://wiki.postgresql.org/wiki/Homebrew)
    * [GraphQL](https://graphql.org/learn/)
    * [Apollo](https://www.apollographql.com/docs/)
    * [Twilio](https://www.twilio.com/docs)
    * [AWS Lambda](https://aws.amazon.com/lambda/)
    * [AWS API Gateway](https://aws.amazon.com/api-gateway/)
    * [AWS RDS](https://aws.amazon.com/rds/)
    * [AWS S3](https://aws.amazon.com/s3/)
    * [AWS Amplify](https://aws.amazon.com/amplify/)
    * [Serverless Stack](https://serverless-stack.com/)

# Resources
*   Slack Channel: #csj-city-meeting-participation
*   [Google Drive](https://drive.google.com/drive/folders/1LAloOcCLCf4Mi-ulkx1ofZw1iIip2T0s)
*   [Links to Visual Design Mocks](https://docs.google.com/document/d/1bsBU2OwlY0_BJ48z_6H8GPl-vv0a86lvGEPuGZqgvGo/edit)
*   [List of TODO items](https://github.com/codeforsanjose/gov-agenda-notifier/projects/2)

# Local Development

## To Begin Work on the Frontend / Serve Frontend
1. Go to the issues page to find something to work on:
    * https://github.com/codeforsanjose/gov-agenda-notifier/issues
2.  Install [Node.js and npm](https://www.npmjs.com/get-npm)
3.  Install project dependencies:
    1. Navigate to the `/frontend` directory
    2. Run command:
        ```bash
        npm install
        ```
4. Make modifications to the codebase to address the issue your working on
5. See your changes:
    1.  Navigate to the `/frontend` directory
    2.  Run command:
        ```bash
        npm run start
        ```

## To Begin Work on the Backend / Serve Backend
Frontend specific development doesn't require these steps. Setting up the DB is only necessary if you'll be wanting to interact with the entire web app, including the backend API.
1. Visit the issues page to find something to work on:
    * https://github.com/codeforsanjose/gov-agenda-notifier/issues
2.  Initialize the local DB
    *   This step requires the `make` utility. 
        *   Additional configuration for this is required on [Windows](https://vispud.blogspot.com/2019/02/how-to-run-makefile-in-windows.html)
    1.  Install [Docker](https://www.docker.com/products/docker-desktop)
    2.  Create the Docker image for the local DB
        * This only needs to be done once unless modifcations have been made to `/server/docker/dev/init.sql`. See notes below.
        1.  Navigate to `/backend/docker/dev/`
        2.  Run command: 
            ```bash
            make image
            ```
    3.  Spin up a corresponding Docker container ("Turn it on")
        1.  Navigate to `/backend/docker/dev/`
        2.  Run command:
            ```bash
            make container
            ```
3.  Create a `.env` file in the `/backend` directory
    1.  Make sure the file includes these keys:
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
        ```
        *   This file is NOT to be included in version control. We don't want secret keys publicly accessible.
        *   Message Trace Ohrt on Slack if you need secret key values
4.  Initialize server locally
    1.  Install project dependencies:
        1. Navigate to the `/backend` directory
        2. Run command:
            ```bash
            npm install
            ```
    2. Start server:
        1. Navigate to the `/backend` directory
        2. Run command: 
            ```bash
            npm run start
            ```
    4. View the GraphQL API playground at http://localhost:3000/graphql
5. Make modifications to the codebase to address the issue you're working on

### Local Dev Notes:
If changes are made to `/backend/docker/dev/init.sql`, the old docker image must be deleted, regenerated and containerized for the changes to take place.

The command for deleting the previous image is:
```bash
make rm-image
```

After deleting the image with that command, follow "2.  Initialize the local DB" steps again for your local DB to be back up and running.

# Deployment

## Configuration:
1.  [Setup the AWS command line interface](https://docs.aws.amazon.com/polly/latest/dg/setup-aws-cli.html)

## Deploy Infrastructure:
1.  Install project dependencies:
    1. Navigate to the `/backend` directory
    2. Run command:
        ```bash
        npm install
        ```
2.  Create a `secrets.json` file in the `/backend` directory:
    1.  Make sure the file includes these keys:
        ```
        {
            "PGUSER": "THIS-IS-TOP-SECRET", 
            "PGPASSWORD": "THIS-IS-TOP-SECRET",
            "PGDATABASE": "THIS-IS-TOP-SECRET", 

            "TWILIO_ACCOUNT_SID": "AC-THIS-IS-TOP-SECRET-AND-NEEDS-TO-START-WITH-AC", 
            "TWILIO_AUTH_TOKEN": "THIS-IS-TOP-SECRET",
            "TWILIO_PHONE_NUMBER": "THIS-IS-TOP-SECRET"
        }
        ```
        *   This file is NOT to be included in version control. We don't want secret keys publicly accessible.
        *   Message Trace Ohrt on Slack if you need secret key values
3.  Deploy:
    1. Navigate to the `/backend` directory
    2. Run command:
        ```bash
        serverles deploy
        ```
4.  Remove deployed infrastructure:
    1. Navigate to the `/backend` directory
    2. Run command:
        ```bash
        serverles remove
        ```
