# DEV Environment Setup Instructions
This short readme will be your guide for setting up your development environemnt for this project.

## Dependencies
* [Docker](https://www.docker.com/products/docker-desktop)
* [Postgres](https://wiki.postgresql.org/wiki/Homebrew)
    * Unneccesary for the majority of this API's development
    * Used for creating `psql` sessions to our Docker container's DB, should you require manual DB access

## DB Initialization Steps
1.  Create the Docker image
    *   Navigate to `/server/docker/dev/`
    *   Run command: 
    ```bash
    make image
    ```
2.  Spin up a corresponding Docker container, making the DB live
    *   Navigate to `/server/docker/dev/`
    * Run command:
    ```bash
    make container
    ```
3.  Profit

## Steps to Establish a `psql` Session to a Running Container's DB
1.  Navigate to `/server/docker/dev/`
2.  Run command: 
```bash
make db-shell
```

## Notes
If changes are made to the `init.sql` file, the docker image must be recreated for the changes to take place.

A helpful command for deleting the previous image is:
```bash
make rm-image
```