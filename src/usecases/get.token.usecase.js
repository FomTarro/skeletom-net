const { AppConfig } = require("../../app.config");
const { httpRequest } = require("../adapters/http.utils");

/**
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {Promise<string>} Token
 */
async function usecase(accessCode, appConfig){

    const data =
    `client_id=${appConfig.PULSOID_CLIENT_ID}` +
    `&client_secret=${appConfig.PULSOID_CLIENT_SECRET}` +
    `&code=${accessCode}` +
    `&grant_type=authorization_code` +
    `&redirect_uri=${'https://www.skeletom.net/vts-heartrate/oauth2/pulsoid'}`

    const opts = {
        host: 'pulsoid.net',
        method: 'POST',
        path: encodeURI('/oauth2/token'),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }

    }
    const result = await httpRequest(opts, data);
    return result;
}

module.exports.GetToken = usecase;