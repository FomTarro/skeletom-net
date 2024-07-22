require('dotenv').config();

/**
 * A dependency injection configuration.
 */
class AppConfig{
    get ENV(){ return process.env.NODE_ENV || 'local'; };
    get PORT(){ return process.env.PORT || 8080; };
    get DOMAIN(){ return process.env.domain || `http://localhost:${this.PORT}` };

    get STREAM_URL(){ return process.env.current_stream_url || 'https://www.twitch.tv/skeletom_ch'; };

    get PULSOID_CLIENT_ID(){ return process.env.pulsoid_client_id; };
    get PULSOID_CLIENT_SECRET(){ return process.env.pulsoid_client_secret; };

    get VTS_HEARTRATE_VERSION(){ return process.env.vts_heartrate_version ? process.env.vts_heartrate_version : "0.0.0" } 
    get VTS_HEARTRATE_DATE(){ return process.env.vts_heartrate_date ? process.env.vts_heartrate_date : "1/7/2022" } 
    get VTS_HEARTRATE_URL(){ return process.env.vts_heartrate_url ? process.env.vts_heartrate_url : "https://github.com/FomTarro/vts-heartrate" } 

    get AMIYAMIGA_VERSION(){ return process.env.amiyamiga_version ? process.env.amiyamiga_version : "0.0.0" } 
    get AMIYAMIGA_DATE(){ return process.env.amiyamiga_version ? process.env.amiyamiga_date : "11/29/2022" } 
    get AMIYAMIGA_URL(){ return process.env.amiyamiga_url ? process.env.amiyamiga_url : "https://skeletom-ch.itch.io/amiyamiga" } 

    get WOLFRAM_CLIENT_ID(){ return process.env.wolfram_client_id; };

    
    get TWITCH_CLIENT_ID(){ return process.env.twitch_client_id; };
    get TWITCH_CLIENT_SECRET(){ return process.env.twitch_client_secret; };
}

const instance = new AppConfig();

module.exports.AppConfig = instance;