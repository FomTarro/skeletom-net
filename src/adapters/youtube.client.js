const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const { VideoDetail } = require('./video.detail');
const { AppConfig } = require('../../app.config');

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
        const url = new URL(`https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&part=snippet,liveStreamingDetails&id=${videoIds.join(',')}`);
        const response = await fetch(url);
        const videoDetails = [];
        if(response.status >= 200 && response.status < 300){
            const json = await response.json();
            for(const item of json.items){
                videoDetails.push(new VideoDetail(
                    item.id,
                    "Stream",
                    "YouTube",
                    item.snippet?.title,
                    item.snippet?.categoryId,
                    `https://www.youtube.com/watch?v=${item.id}`,
                    item.liveStreamingDetails && (item.liveStreamingDetails.actualStartTime && !item.liveStreamingDetails.actualEndTime)
                ));
            }
        }else{
             console.error(`Error fetching video list details for channel ID ${channelId} - ${response.statusText}`);
        }
        return videoDetails;
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
}

module.exports.YouTubeClient = YouTubeClient;