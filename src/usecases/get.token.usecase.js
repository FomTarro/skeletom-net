const { AppConfig } = require("../../app.config");
const { httpRequest } = require("../adapters/http.utils");

/**
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {string} Token
 */
async function usecase(accessCode, appConfig){


    const data = JSON.stringify({
        client_id: appConfig.PULSOID_CLIENT_ID,
        client_secret: appConfig.PULSOID_CLIENT_SECRET,
        code: accessCode,
        grant_type: 'authorization_code',
        redirect_uri: 'https://www.skeletom.net/vts-heartrate/oauth2/pulsoid'
    })

    const url = 
    `/oauth2/token?client_id=${appConfig.PULSOID_CLIENT_ID}` +
    `&client_secret=${appConfig.PULSOID_CLIENT_SECRET}` +
    `&code=${accessCode}` +
    `&grant_type=authorization_code&redirect_uri=${'https://www.skeletom.net/vts-heartrate/oauth2/pulsoid'}`

    const opts = {
        host: 'pulsoid.net',
        method: 'POST',
        path: encodeURI(url),
        headers: {
            'Content-Type': 'multipart/form-data',
        }

    }
    httpRequest(opts, undefined).then(s => {console.log(s)}).catch((e) => {console.error(e)});
    // console.log(result);
}

module.exports.GetToken = usecase;