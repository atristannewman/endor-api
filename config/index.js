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

let services = {
    stytch: {
        projectId: process.env.STYTCH_TEST_PROJECT_ID,
        secret: process.env.STYTCH_TEST_SECRET,
        publicToken: process.env.STYTCH_TEST_PUBLIC_TOKEN
    }
}

let env = process.env.ENV;
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
        site.url = process.env.PRODUCTION_URL;
        site.port = process.env.WEB_LOCAL_PORT
        services.stytch.projectId = process.env.STYTCH_LIVE_PROJECT_ID;
        services.stytch.secret = process.env.STYTCH_LIVE_SECRET;
        services.stytch.publicToken = process.env.STYTCH_LIVE_PUBLIC_TOKEN;
        break;
    default:
        break
}

module.exports = { db, site, services };