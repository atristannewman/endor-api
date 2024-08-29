let db = {
    host: process.env.HEROKU_DEVELOPMENT_DB_HOST,
    user: process.env.HEROKU_DEVELOPMENT_DB_USER,
    password: process.env.HEROKU_DEVELOPMENT_DB_PASSWORD,
    name: process.env.HEROKU_DEVELOPMENT_DB_NAME,
    port: process.env.HEROKU_DEVELOPMENT_DB_PORT
};

let site = {
    url: process.env.LOCAL_URL,
    port: process.env.WEB_LOCAL_PORT
};

let env = process.env.ENV || 'development';
switch (env) {
    case 'development':
        db.host = process.env.HEROKU_DEVELOPMENT_DB_HOST;
        db.user = process.env.HEROKU_DEVELOPMENT_DB_USER;
        db.password = process.env.HEROKU_DEVELOPMENT_DB_PASSWORD
        db.name = process.env.HEROKU_DEVELOPMENT_DB_NAME
        db.port = process.env.DB_PORT
        site.url = process.env.LOCAL_URL;
        site.port = process.env.WEB_LOCAL_PORT
        break;
    case 'production':
        break;
    default:
        break
}

module.exports = { db, site };