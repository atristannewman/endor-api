require('dotenv').config(); // this is important!
module.exports = {
    "development": {
        "username": process.env.NAME,
        "password": process.env.PASSWORD,
        "database": process.DATABASE,
        "host": process.env.HOST,
        "dialect": "postgres"

    },
    "test": {
        "username": process.env.NAME,
        "password": process.env.PASSWORD,
        "database": process.DATABASE,
        "host": process.env.HOST,
        "dialect": "postgres"
    },
    "production": {
        "use_env_variable": 'DATABASE_URL',
        "dialect": "postgres",
        "protocol": "postgres",
        "ssl": true,
        "dialectOptions": {
            "ssl": {
                "require": true,
                "rejectUnauthorized": false
            }
        }
    }
};