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
# Hangout API



# Description :  This API will add hangout but need to pass user_id in body 

POST/api/hangouts
REQUEST PARAMETERS:
````
body:
   {
     "name":" ",
     "startTime":" ",
     "endTime":" ",
     "address":" ",
     "tags":[""," "], 
     "user_id":" "
}
````
#  Description :  This API will get all the hangouts with its hosts(users) 

GET/api/hangouts
REQUEST PARAMETERS:
```
```

# One-to-Many relationship 

1. we have implemented One to many relation between User and Hangouts.

2. Users have many hangouts but hangout only belongs to user.

3. foreign key we have created is user_id in hangouts.





## Errors:

"ConnectionRefusedError [SequelizeConnectionRefusedError]: connect ECONNREFUSED 127.0.0.1:5432"
