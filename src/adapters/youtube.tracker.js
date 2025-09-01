const { YouTubeClient } = require("./youtube.client");

class YouTubeTracker {
    /**
     * A class used to track YouTube channels for streams going live.
     * @param {YouTubeClient} client 
     * @param {string} channelHandle - the channel ID 
     */
    constructor(client, channelId){
        this.client = client;
        this.channelHandle = channelHandle;
    }
}