TERRAFORM=cd terraform; terraform
GRAPHQL_API_LAMBDA_DIR=../backend/graphql_api/lambda

clean:
	rm -f *.zip

init:
	$(TERRAFORM) init || exit 1

install-lambda-dep:
	cd ../backend/graphql_api/lambda; npm install

zip-lambda:
	cd $(GRAPHQL_API_LAMBDA_DIR); zip -r ../../../infrastructure/gan_graphql_lambda.zip .

deploy: clean install-lambda-dep zip-lambda init
	$(TERRAFORM) apply

destroy:
	$(TERRAFORM) destroy
