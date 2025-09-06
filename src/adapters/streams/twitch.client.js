const { AppConfig } = require('../../../app.config');
const { VideoDetail } = require('./video.detail');
const { customFetch } = require('../../utils/custom.fetch');

class TwitchClient {
    /**
     * 
     * @param {AppConfig} appConfig 
     */
    constructor(appConfig){
        this.client_id = appConfig.TWITCH_CLIENT_ID;
        this.client_secret = appConfig.TWITCH_CLIENT_SECRET;
    }

    async getToken(){
        const url = new URL(`https://id.twitch.tv/oauth2/token`);
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("client_secret", this.client_secret);
        url.searchParams.append("grant_type", "client_credentials");
        const response = await customFetch(url, {
            method: 'POST'
        });
        if(response.status >= 200 && response.status < 300){
            const json = await response.json();
            return json["access_token"];
        }
        return "BAD_TOKEN";
    }

    /**
     * 
     * @param {string[]} loginNames 
     * @returns 
     */
    async getChannelListDetails(loginNames){
        const token = await this.getToken();
        const url = new URL(`https://api.twitch.tv/helix/streams`);
        for(const loginName of loginNames){
            url.searchParams.append("user_login",loginName);
        }
        const response = await customFetch(url, {
            headers: {
                'Client-ID': this.client_id,
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': `Bearer ${token}`
            }
        });
        const streamDetails = [];
        const foundChannels = [];
        if(response.status >= 200 && response.status < 300){
            const json = await response.json();
            for(const data of json.data){
                foundChannels.push(data.user_login);
                streamDetails.push(new VideoDetail(
                    data.id,
                    data.user_login,
                    "Stream",
                    "Twitch",
                    data.title,
                    data.game_name,
                    `https://www.twitch.tv/${data.user_login}`,
                    true
                ));
            }
        }
        // TODO: check how youtube handles missing data. Do we really need to create blank records?
        const remainingChannelNames = loginNames.filter(name => !foundChannels.includes(name));
        for(const name of remainingChannelNames){
            streamDetails.push(new VideoDetail(
                0,
                name,
                "Stream",
                "Twitch",
                "",
                "",
                `https://www.twitch.tv/${name}`,
                false
            ));
        }
        return streamDetails;
    }
}

module.exports.TwitchClient = TwitchClient;