const { YouTubeClient, VideoData } = require("./youtube.client");

class YouTubeTracker {
    /**
     * A class used to track YouTube channels for streams going live.
     * @param {YouTubeClient} client 
     */
    constructor(client){
        this.client = client;
        /**
         * Indexed by channelHandle
         * @type {Map<string, TrackedChannel>}
         */
        this.channels = new Map();
        this.handledVideos = [];
        this.interval = setInterval(this.scanAndNotify.bind(this), 30*1000);
    }

    /**
     * @callback OnLiveCallback
     */

    /**
     * 
     * @param {string} channelHandle 
     * @param {OnLiveCallback} onLive - Callback executed when a stream is detected as finally going live.
     */
    async trackChannel(channelHandle, onLive) {
        if (!this.channels.has(channelHandle)) {
            const channelId = await this.client.getChannelId(channelHandle);
            this.channels.set(channelHandle, new TrackedChannel(channelId, channelHandle, onLive));
            console.log(`Now tracking channel ${channelHandle}`);
        } else {
            console.warn(`Channel ${channelHandle} is already being tracked!`);
        }
    }

    async untrackChannel(channelHandle) {
        if (this.channels.has(channelHandle)) {
            this.channels.delete(channelHandle);
            console.log(`No longer tracking channel ${channelHandle}`);
        } else {
            console.warn(`Channel ${channelHandle} was not being tracked!`);
        }
    }

    async getCurrentlyLiveForChannel(channelHandle) {
        const liveDetails = []
        if (this.channels.has(channelHandle)) {
            for (const [id, video] of this.channels.get(channelHandle).videoDetails) {
                if (video.isLive) {
                    liveDetails.push(video);
                }
            }
        } else {
            console.warn(`Channel ${channelHandle} was not being tracked!`);
        }
        return liveDetails;
    }

    async scanAndNotify() {
        // for every tracked channel
        /**
         * Indexed by channelHandle
         * @type {Map<string, string>}
         */
        const videosToSearch = new Map();
        for (const [key, value] of this.channels) {
            // get updated video list for the channel
            const videos = await this.client.getRecentVideoList(value.channelId);
            // console.log(`Found videos for channel ${key}: ${videos.map(v => v.id)}`);
            for (const video of videos) {
                // populate map of video ids, linking them to their corresponding channels
                videosToSearch.set(video.id, value.channelHandle);
            }
        }
        // chunk our videos into groups of 20 to query against the API
        const videoIds = [...videosToSearch.keys()]
        // console.log(`Preparing the following videos to query: ${videoIds}`);
        for (let i = 0; i < videoIds.length; i += 20) {
            const chunk = videoIds.slice(i, i + 20);
            const videoDetails = await this.client.getVideoListDetails(chunk);
            // process results
            for (const detail of videoDetails) {
                const originalHandle = videosToSearch.get(detail.id);
                const trackedChannel = this.channels.get(originalHandle);
                // if the video comes back as being Live, and we either have no record of it or have a record of it NOT being live..
                const isNowLive = detail.isLive && (!trackedChannel.videoDetails.has(detail.id) || !trackedChannel.videoDetails.get(detail.id).isLive);
                trackedChannel.videoDetails.set(detail.id, detail);
                if (detail.isLive && !this.handledVideos.includes(detail.id)) {
                    console.log(`Handling OnLive callback for video: ${detail.id}`);
                    // flag it as handled
                    // TODO: this is not satisfactory as it doesn't allow us to learn 
                    // which streams are CURRENTLY live for each channel after the fact.
                    // (which is something we want to do for clients that connect mid-stream)
                    // We need to re-implement a map of video data for each channel
                    this.handledVideos.push(detail.id);
                    // keep the record relatively short
                    if (this.handledVideos.length > 1000) {
                        this.handledVideos.shift();
                    }
                    // invoke the OnLive callback for the corresponding channel
                    trackedChannel.onLive(detail);
                }
            }
        }
    }
}

class TrackedChannel {
    /**
     * 
     * @param {string} channelId 
     * @param {string} channelHandle 
     * @param {OnLiveCallback} onLive 
     */
    constructor(channelId, channelHandle, onLive) {
        this.channelId = channelId;
        this.channelHandle = channelHandle;
        this.onLive = onLive;
        /**
         * Indexed by video ID, this needs to become an LRU or something
         * @type {Map<string, VideoData>}
         */
        this.videoDetails = new Map();
    }
}

module.exports.YouTubeTracker = YouTubeTracker;