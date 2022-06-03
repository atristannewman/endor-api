# griph-api

HOW TO RUN SERVER:

Pre-requisite

1. create .env file in the root folder.
2. Add the following environment variables:]
   ETHSCAN_TOKEN={ask a dev}
   PORT={what do you want it to be?}
3. ETHPLORER_TOKEN={ask a dev}
4. NAME={ask a dev. its on heroku}
   PASSWORD={ask a dev. its on heroku}
   DATABASE={ask a dev. its on heroku}
   HOST={ask a dev. its on heroku}
   PROD_ENV="1"

START THE SERVER:

1. Run npm install
2. Run npm run dev

Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express
https://www.youtube.com/watch?v=CnailTcJV_U&t=1296s

APIs:

# Use the base url below for testing on a local machine

http://localhost:8500/

# Description: This API will get the history of the public address.

GET /api/transactions/history?address=<wallet address>

# Description: This API will list down all tokens and its value for given public address

GET /api/transactions/getTokenList?address=<wallet address>

# Vendor APIs

## Description: This API will gets all vendors from database

GET /api/vendors

## Description: This API will posts a vendor to the database

POST /api/vendors
REQUEST PARAMETERS:

```
{
   "name": "JPs Studio",
   "location": "123 Broad Street New York, New York 12345",
   "isActive": true,
   "accessUrl": "https://www.eventbrite.com/e/summer-party-2016-tickets-26784599458,
}
```

## Description: This API will updates a vendor given the vendor

PUT /api/vendors

REQUEST PARAMETERS:

```
{
   "id": 95,
   "name": "JPs Studio",
   "location": "123 Broad Street New York, New York 12345",
   "isActive": true,
   "accessUrl": "<https://www.eventbrite.com/e/summer-party-2016-tickets-26784599458>,
}
```

## Description: This API will deletes a vendor given the vendor’s id

DELETE /api/vendors
REQUEST PARAMETERS:

```
{
   "id": 95
}
```

## Errors:

"ConnectionRefusedError [SequelizeConnectionRefusedError]: connect ECONNREFUSED 127.0.0.1:5432"

## Undo all migrations

`npx sequelize-cli db:migrate:undo:all`

## Running migrations to create tables and columns into database

## To create table

1. Run below command to create a blank migration file
   `npx sequelize-cli migration:generate --name <name of migration file>`
2. Write required queries in newly created migration file as shown in
   `sampleMigrations/20220602175116-create_user_table.js`
3. Run below command to run queries written in migration file
   `npx sequelize-cli db:migrate`
   This command will update the database

## To add column

1. Run below command to create a blank migration file
   `npx sequelize-cli migration:generate --name <name of migration file>`
2. Write required queries in newly created migration file as shown in
   `sampleMigrations/20220603090126-add_column_new_column.js`
3. Run below command to run queries written in migration file
   `npx sequelize-cli db:migrate`
   This command will update the database
4. Add newly created column in your models, functions and validations
   `databases/postgres/entity/user.js` `model/user/user.js` `validation/user.js`

## To remove column

1. Run below command to create a blank migration file
   `npx sequelize-cli migration:generate --name <name of migration file>`
2. Write required queries in newly created migration file as shown in
   `sampleMigrations/20220603093009-remove_column_new_column.js`
3. Run below command to run queries written in migration file
   `npx sequelize-cli db:migrate`
   This command will update the database
4. Add newly created column in your models, functions and validations
   `databases/postgres/entity/user.js` `model/user/user.js` `validation/user.js`

# User APIs

## Description: This API will gets all users from database

GET /api/users

## Description: This API will post a user to the database

POST /api/users
REQUEST PARAMETERS:

```
{
   "address": "address of user",
   "hasProof": false,
   "hasMoonbird": true
}
```
