require('dotenv').config();

/**
 * A dependency injection configuration.
 */
class AppConfig{
    get ENV(){ return process.env.NODE_ENV || 'local'; };
    get PORT(){ return process.env.PORT || 8080; };
    get DOMAIN(){ return process.env.domain || `http://localhost:${this.PORT}` };

    get PULSOID_CLIENT_ID(){ return process.env.pulsoid_client_id; };
    get PULSOID_CLIENT_SECRET(){ return process.env.pulsoid_client_secret; };
}

const instance = new AppConfig();

module.exports.AppConfig = instance;