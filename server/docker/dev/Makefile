DOCKER_IMAGE_NAME=pg-dev-image
DOCKER_CONTAINER_NAME=pg-dev-container
LOCAL_DB_PORT=8888

# You only need to do this once
image:
	docker build -t $(DOCKER_IMAGE_NAME) .

# Deletes image created in preivous step, should you need to rebuild
rm-image:
	docker image rm $(DOCKER_IMAGE_NAME)

# Run this everytime you need to spin up the DB locally
container:
	docker run --rm -p $(LOCAL_DB_PORT):5432 --name $(DOCKER_CONTAINER_NAME) $(DOCKER_IMAGE_NAME)

# Initialize a DB shell session within your container
db-shell:
	PGPASSWORD=docker psql -h localhost -p $(LOCAL_DB_PORT) -d docker -U docker
