const { AppConfig } = require('../../app.config');
const { httpRequest } = require("./http.utils");

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {string} - the token!
 */
async function getToken(appConfig){
    const url = new URL(`https://id.twitch.tv/oauth2/token`);
    url.searchParams.append("client_id", appConfig.TWITCH_CLIENT_ID);
    url.searchParams.append("client_secret", appConfig.TWITCH_CLIENT_SECRET);
    url.searchParams.append("grant_type", "client_credentials");
    const response = await httpRequest({
        host: url.host,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
    });
    if(response.statusCode < 400){
        return response.body["access_token"];
    }
    return "BAD_TOKEN";
}

/**
 * A Blog/Project Post data structure
 * @typedef {Object} StreamData
 * @property {string} status - Either "ONLINE" or "OFFLINE"
 * @property {string | undefined} title - The title of the stream, if it is online.
 * @property {string | undefined} game - The title of the game being played, if it is online.
 */

/**
 * 
 * @param {string} loginName - The channel name (not ID)
 * @param {AppConfig} appConfig
 * @returns {StreamData} - Information about the stream
 */
async function getChannelStatus(loginName, appConfig){
    const token = await getToken(appConfig);
    const url = new URL(`https://api.twitch.tv/helix/streams`);
    url.searchParams.append("user_login",loginName);
    if(token){
        const response = await httpRequest({
            host: url.host,
            path: `${url.pathname}${url.search}`,
            method: 'GET',
            headers: {
                'Client-ID': appConfig.TWITCH_CLIENT_ID,
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.body.data.length > 0){
            return {
                status: "ONLINE",
                title: response.body.data[0].title,
                game: response.body.data[0].game_name
            }
        }
    }
    return {
        status: "OFFLINE",
    }
}

module.exports.getChannelStatus = getChannelStatus;