const jsdom = require('jsdom')
const { JSDOM } = jsdom;

class YouTubeClient {
    /**
     * A YouTube API Client.
     * @param {AppConfig} appConfig - Application config.
     */
    constructor(appConfig){
        this.apiKey = appConfig.YOUTUBE_CLIENT_API_KEY;
    }

    /**
     * Gets a list of ID and titles for recent videos for a channel.
     * @param {string} channelId - Channel UUID
     */
    async getRecentVideoList(channelId){
        const url = new URL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const response = await fetch(url);
        const videos = [];
        if(response.status >= 200 && response.status < 300){
            const text = await response.text();
            const xml = new JSDOM(text);
            const entries = xml.window.document.getElementsByTagName('entry');
            for(const entry of entries){
                const id = entry.getElementsByTagName('yt:videoId')[0].innerHTML;
                const title = entry.getElementsByTagName('title')[0].innerHTML;
                videos.push({
                    id,
                    title
                });
            }
        }else{
            console.error(`Error fetching upcoming video list for channel ID ${channelId} - ${response.statusText}`);
        } 
        return videos;
    }

    /**
     * Gets a list of metadata about the provided list of video IDs.
     * @param {string[]} videoIds - A list of video IDs to query for.
     */
    async getVideoListDetails(videoIds){
        console.log(videoIds);
        const url = new URL(`https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&part=snippet,liveStreamingDetails&id=${videoIds.join(',')}`);
        const response = await fetch(url);
        const videos = [];
        if(response.status >= 200 && response.status < 300){
            const json = await response.json();
            for(const item of json.items){
                videos.push(new videoDetail(
                    item.id,
                    item.kind,
                    item.snippet?.title,
                    `https://www.youtube.com/watch?v=${item.id}`,
                    item.liveStreamingDetails && (item.liveStreamingDetails.actualStartTime && !item.liveStreamingDetails.actualEndTime)
                ));
            }
        }else{
             console.error(`Error fetching video list details for channel ID ${channelId} - ${response.statusText}`);
        }
        return videos;
    }

    async getChannelId(channelName){
        const url = new URL(`https://www.googleapis.com/youtube/v3/channels?key=${this.apiKey}&forHandle=${channelName}&part=id`);
        const response = await fetch(url);
        if(response.status >= 200 && response.status < 300){
            const json = await response.json();
            const id = json.items ? json.items[0].id : undefined;
            return id;
        }else{
            console.error(`Error fetching channel ID for channel ID ${channelName} - ${response.statusText}`);
        }
        return undefined;
    }

    // TODO - record a DB of video IDs, then check the IDs for details. 
    // Details that have an actualStartTime property are live, 
    // and ones that have an actualEndTime property are done.
    // Thus, a stream is live if it has actualStartTime and NOT actualEndTime.

    // Websocket Server will ping all registered clients when a stream goes live initially, 
    // and also inform a new connection if there's currently a live stream
    // Similarly, clients will keep track of stream IDs they've been informed of

    // This creates a safeguard against the server rebooting mid-stream 
    // and forgetting which streams it has pinged about.
}

class videoDetail {
    /**
     * 
     * @param {string} id 
     * @param {string} type 
     * @param {string} title 
     * @param {string} url
     * @param {boolean} isLive 
     */
    constructor(id, type, title, url, isLive) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.url = url;
        this.isLive = isLive;
    }
}

module.exports.YouTubeClient = YouTubeClient;
module.exports.VideoDetail = videoDetail;