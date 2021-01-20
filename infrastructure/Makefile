TERRAFORM=cd terraform; terraform

GRAPHQL_LAMBDA_DIR=../backend/graphql_api/lambda
GRAPHQL_LAMBDA_ZIP_FILENAME=gan_graphql_lambda.zip

AGENDA_UPLOADER_LAMBDA_DIR=../backend/agenda_upload_service/lambda
AGENDA_UPLOADER_LAMBDA_ZIP_FILENAME=gan_agenda_upload_lambda.zip

clean:
	rm -f *.zip

install-dep:
	cd $(GRAPHQL_LAMBDA_DIR); npm install ; cd -
	cd $(AGENDA_UPLOADER_LAMBDA_DIR); npm install ; cd -

zip-lambdas:
	cd $(GRAPHQL_LAMBDA_DIR); zip -r ../../../infrastructure/$(GRAPHQL_LAMBDA_ZIP_FILENAME) . ; cd -
	cd $(AGENDA_UPLOADER_LAMBDA_DIR); zip -r ../../../infrastructure/$(AGENDA_UPLOADER_LAMBDA_ZIP_FILENAME) .

init:
	$(TERRAFORM) init || exit 1

deploy: clean install-dep zip-lambdas init
	$(TERRAFORM) apply

destroy:
	$(TERRAFORM) destroy
