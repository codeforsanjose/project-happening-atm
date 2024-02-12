# Happening At The Moment (ATM)

It's common for city council, planning and commission meetings to only list one start time. The agenda items aren't scheduled for specific times because they do not know how long it will take to discuss each item. This leaves attendees wondering when they'll be able to comment on the agenda item they're interested in.

This problem has become a growing issue in the era of COVID-19 since virtual meetings are becoming more common. This web app allows meeting participants to "subscribe" to meeting items for notifications via text or email. Participants will benefit greatly from a notification system rather than be on stand-by for an undetermined length of time.

The City of San Jose is interested in this service, but this is a project that can scale to other cities as well.

# Software Tech Stack

- Frontend
  - React.js + hooks
  - SASS
- Backend
  - [Node.js and npm](https://www.npmjs.com/get-npm)
  - [GraphQL](https://graphql.org/learn/) for backend.
  - [Apollo](https://www.apollographql.com/docs/) for backend.
  - [Postgres](https://www.postgresql.org/about/)
  - [AWS S3](https://aws.amazon.com/s3/)
  - [Twilio](https://www.twilio.com/docs) for sending SMS.
  - [AWS SES](https://aws.amazon.com/s3/) for sending emails.
  - [Docker](https://www.docker.com/products/docker-desktop) to bring up development environment.

# Resources

- Discord Channel: [#proj-happening-atm-eng](https://discord.gg/Pr9QATNxXD)
- [Google Drive](https://drive.google.com/drive/folders/1a89AKh3Kia3BGYeMUF7ishE4avblFIYu?usp=sharing)
- [Links to Visual Design Mocks](https://docs.google.com/document/d/1Jcdsw6d8MMXWaU_PTPcMVtoTtBxtx4A7d0VfhMH7K5M/edit)
- [Latest Kanban ToDo list](https://trello.com/b/pfECjOgE/happening-atm) TODO: Update to JIRA board?

- [User Stories Board](https://miro.com/app/board/o9J_leAd8y8=/)


# Build & Deploy Pipeline

Application is hosted on AWS
  - [AWS ECS (Elastic Container Serivce)](https://aws.amazon.com/ecs/)
  - [AWS RDS](https://aws.amazon.com/rds/) for database.
[Github Actions](https://docs.github.com/en/actions) is utilized for CI/CD. See `.github/workflows/` for workflows.

## Testing Pipeline

TODO via Github Actions

## Set up local environment development
- Install Docker
- Run the app, and wait for the engine to run (green status bar on bottom left)
- In the terminal, go to your repository and run `docker compose build`. You only need to run this command once, then you can bring up your environment again by using `docker compose up`.



## Live deployments
  - `stage`: [https://happening-atm-stage.codeforsanjose.org](https://happeningatm-stage.opensourcesanjose.org/login)
  - `prod`: Production is not live yet

## Contributing

Any and all PRs are welcome. Please see [this documentation](./CONTRIBUTING.md).

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
