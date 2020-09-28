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
    * Express
    * GraphQL
    * Apollo
    * Twilio
    * [Postgres](https://wiki.postgresql.org/wiki/Homebrew)
    * [Docker](https://www.docker.com/products/docker-desktop)

# Local Development

## To Begin Work on the Frontend / Serve Frontend
1. Go to the issues page to find something to work on:
    * https://github.com/codeforsanjose/gov-agenda-notifier/issues
2.  Install [Node.js and npm](https://www.npmjs.com/get-npm)
3.  Install project dependencies:
    1. Navigate to the root of the project's directory
    2. Run command:
        ```bash
        npm install
        ```
4. Make modifications to the codebase to address the issue your working on
5. See your changes:
    1.  Navigate to the root of the project's directory
    2.  Run command:
        ```bash
        npm run start
        ```

## To Begin Work on the Backend / Serve the Entire Web App (Backend + Frontend)
Frontend specific development doesn't require these steps. Setting up the DB is only necessary if you'll be wanting to interact with the entire web app, including the backend API.
1. Go to the issues page to find something to work on:
    * https://github.com/codeforsanjose/gov-agenda-notifier/issues
2.  Initialize the local DB
    1.  Install [Docker](https://www.docker.com/products/docker-desktop)
    2.  Create the Docker image for the local DB
        * This only needs to be done once unless modifcations have been made to `/server/docker/dev/init.sql`. See notes below.
        1.  Navigate to `/server/docker/dev/`
        2.  Run command: 
            ```bash
            make image
            ```
    3.  Spin up a corresponding Docker container ("Turn it on")
        1.  Navigate to `/server/docker/dev/`
        2.  Run command:
            ```bash
            make container
            ```
3.  Initialize server
    1.  Install project dependencies:
        1. Navigate to the root of the project's directory
        2. Run command:
            ```bash
            npm install
            ```
    2.  Run command:
        ```bash
        npm run dev
        ```
4. Make modifications to the codebase to address the issue your working on

### Notes
If changes are made to `/server/docker/dev/init.sql`, the old docker image must be deleted, regenerated and containerized for the changes to take place.

The command for deleting the previous image is:
```bash
make rm-image
```

After deleting the image with that command, follow "2.  Initialize the local DB" steps again for your local DB to be back up and running.