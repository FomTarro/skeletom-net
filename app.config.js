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

    get VTS_MIDI_VERSION(){ return process.env.vts_midi_version ? process.env.vts_midi_version : "1.0.0" } 
    get VTS_MIDI_DATE(){ return process.env.vts_midi_date ? process.env.vts_midi_date : "10/10/2024" } 
    get VTS_MIDI_URL(){ return process.env.vts_midi_url ? process.env.vts_midi_url : "https://www.skeletom.net" } 

    get AMIYAMIGA_VERSION(){ return process.env.amiyamiga_version ? process.env.amiyamiga_version : "0.0.0" } 
    get AMIYAMIGA_DATE(){ return process.env.amiyamiga_version ? process.env.amiyamiga_date : "11/29/2022" } 
    get AMIYAMIGA_URL() { return process.env.amiyamiga_url ? process.env.amiyamiga_url : "https://skeletom-ch.itch.io/amiyamiga" } 
    
    get MINT_DESKTOP_VERSION(){ return process.env.mint_desktop_version ? process.env.mint_desktop_version : "1.0.0" } 
    get MINT_DESKTOP_DATE(){ return process.env.mint_desktop_date ? process.env.mint_desktop_date : "10/01/2024" } 
    get MINT_DESKTOP_URL(){ return process.env.mint_desktop_url ? process.env.mint_desktop_url : "https://www.skeletom.net" } 

    get WORD_SALAD_VERSION(){ return process.env.word_salad_version ? process.env.word_salad_version : "1.0.0" } 
    get WORD_SALAD_DATE(){ return process.env.word_salad_date ? process.env.word_salad_date : "01/30/2025" } 
    get WORD_SALAD_URL(){ return process.env.word_salad_url ? process.env.word_salad_url : "https://www.skeletom.net" } 


    get WOLFRAM_CLIENT_ID(){ return process.env.wolfram_client_id; };

    get TWITCH_CLIENT_ID(){ return process.env.twitch_client_id; };
    get TWITCH_CLIENT_SECRET(){ return process.env.twitch_client_secret; };

    get AWS_CLIENT_ID(){ return process.env.aws_client_id; };
    get AWS_CLIENT_SECRET(){ return process.env.aws_client_secret; };
}

const instance = new AppConfig();

module.exports.AppConfig = instance;