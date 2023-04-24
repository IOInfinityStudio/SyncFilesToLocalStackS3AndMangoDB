## Upload JSON File to AWS S3 bucket in Localstack

Use the below GitHub repository to develop JS/TypeScript projects.

    > https://github.com/IOInfinityStudio/JsDevContainerTools


## Run JS example

    > cd JsDevContainerTools/


    > ./docker.sh -h


    > ./docker.sh js-container-console


    > (container)$ node examples/example_greeter.js 
        Hello, Alice!
        Hello, Bob!
    
## Install AWS SDK 

    > (container)$ yarn add aws-sdk mangodb axios koa aws-sdk-mock mocha sinon chai jest mongodb-memery-server

## Run Localstack container

    > ./docker.sh run-localstack

    > ./docker.sh console-localstack

    > (localstack container)$ aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket users --region us-east-1

## Run S3 Upload JSON file
   
    > ./docker.sh js-container-console

    > (js-dev container)$ cd examples && node example_s3_upload_jsonfile.js

## Run MangoDB container
    
    > ./docker.sh run-mangodb

## Install MangoDB Compass
    Go to the MongoDB Download Center (https://www.mongodb.com/try/download/compass) and download the version of MongoDB Compass that is appropriate for your operating system.

## MangoDB database and collection
    Assuming you meant MongoDB Compass, here are the steps to create a database called "nodejs_proj" and a collection called "users" using MongoDB Compass:

    1. Open MongoDB Compass.

    2. In the "New Connection" dialog box, enter the connection details for your MongoDB server and click "Connect."

    3. Once you are connected to the server, click on the "Create Database" button in the left-hand navigation menu.

    4. In the "Create Database" dialog box, enter "nodejs_proj" as the name for your new database and click "Create."

    5. Once your new database has been created, click on its name in the left-hand navigation menu to open it.

    6. To create a new collection, click on the "Create Collection" button.

    7. In the "Create Collection" dialog box, enter "users" as the name for your new collection and click "Create."


## Run MangoDB example

    > (container)$ cd examples && node example_sync_jsonfile_from_s3_to_mangodb_and_read_data_from_mango_db.js

## Run KOA API service

    > ./docker.sh run-koa

## KOA API Request 

    > curl -i -H "Accept: application/json" "http://localhost:3000/users/mongodb"