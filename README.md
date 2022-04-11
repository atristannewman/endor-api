# griph-api

HOW TO RUN SERVER:

Pre-requisite

1. create .env file in the root folder.
2. Add the following environment variables:]
   ETHSCAN_TOKEN="AEFAZJQYPJPXWD3YU7U5D8Y5E7YTVR7JNU"
   PORT="8500"
3. ETHPLORER_TOKEN="EK-fa7oj-AETzsf3-LJUmS"

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
