const { AppConfig } = require("../../app.config");
const { httpRequest } = require("../adapters/http.utils");

/**
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {string} Token
 */
async function usecase(appConfig){

    const path = `/o/oauth2/v2/auth?redirect_uri=https://www.skeletom.net/vts-heartrate/oauth2/google&prompt=consent&response_type=code&client_id=${appConfig.GOOGLE_CLIENT_ID}&scope=https://www.googleapis.com/auth/fitness.heart_rate.read&access_type=offline`;

    const opts = {
        host: 'accounts.google.com',
        method: 'GET',
        path: encodeURI(path),
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     'Content-Length': data.length
        // }
    }
    let result = await httpRequest(opts);
    do{
        // TODO: split the redirect URL
        const url = new URL(result.redirect);
        console.log(url.host);
        console.log(encodeURI(url.pathname));
        const redirectOpts = {
            host: url.host,
            method: 'GET',
            path: encodeURI(url.pathname),
        }
        result = await httpRequest(redirectOpts);
    }while(result.redirect);
    return result;
}

module.exports.GetGoogleAuth = usecase;