const { AppConfig } = require("../../app.config");
const { OAuth2Client } = require('google-auth-library');
const { httpRequest } = require("../adapters/http.utils");

/**
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {string} Token
 */
async function usecase(appConfig, code){
    const oAuth2Client = getAuthenticatedClient(appConfig);
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    return r;
}

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns { OAuth2Client } Auth client.
 */
function getAuthenticatedClient(appConfig) {
    // create an oAuth client to authorize the API call.
    const oAuth2Client = new OAuth2Client(
        appConfig.GOOGLE_CLIENT_ID,
        appConfig.GOOGLE_CLIENT_SECRET,
        'https://www.skeletom.net/vts-heartrate/oauth2/google'
    );
    return oAuth2Client;
}

module.exports.GetGoogleAuth = usecase;