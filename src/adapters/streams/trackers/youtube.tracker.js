const { YouTubeClient } = require("../youtube.client");
const { VideoDetail } = require("../video.detail");
const { TrackedChannel, OnLiveCallback } = require('./tracked.channel');

class YouTubeTracker {
    /**
     * A class used to track YouTube channels for streams going live.
     * @param {YouTubeClient} client 
     */
    constructor(client) {
        this.client = client;
        /**
         * Indexed by channelHandle
         * @type {Map<string, TrackedChannel>}
         */
        this.channels = new Map();
    }

    start() {
        this.stop();
        this.interval = setInterval(this.scanAndNotify.bind(this), 30 * 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    getTrackedChannelList() {
        return [...this.channels.keys()];
    }

    /**
     * 
     * @param {string} channelHandle 
     * @param {string} callbackId
     * @param {OnLiveCallback} onLive - Callback executed when a stream is detected as finally going live.
     */
    async trackChannel(channelHandle, callbackId, onLive) {
        if (!this.channels.has(channelHandle)) {
            const channelId = await this.client.getChannelId(channelHandle);
            if (channelId) {
                this.channels.set(channelHandle, new TrackedChannel(channelId, channelHandle, onLive));
                console.log(`Now tracking YouTube Channel ${channelHandle}`);
            } else {
                console.warn(`Cannot track YouTube Channel ${channelHandle} as no channel ID could be found`);
            }
        }
        if (this.channels.has(channelHandle)) {
            console.log(`Adding callback with ID ${callbackId} for YouTube Channel ${channelHandle}`);
            this.channels.get(channelHandle).addOnLiveCallback(callbackId, onLive);
        }
    }

    /**
     * 
     * @param {string} channelHandle 
     * @param {string} callbackId
     */
    async untrackChannel(channelHandle, callbackId) {
        if (this.channels.has(channelHandle)) {
            console.log(`Removing callback with ID ${callbackId} for YouTube Channel ${channelHandle}`);;
            this.channels.get(userLogin).removeOnLiveCallback(callbackId);
            if (this.channels.get(userLogin).onLive.size <= 0) {
                this.channels.delete(userLogin);
                console.log(`All callbacks removed, no longer tracking YouTube Channel ${channelHandle}`);
            }
        } else {
            console.warn(`YouTube Channel ${channelHandle} was not being tracked!`);
        }
    }

    /**
     * 
     * @param {string} channelHandle 
     * @returns {Promise<VideoDetail[]>}
     */
    async getCurrentlyLiveForChannel(channelHandle) {
        const liveDetails = []
        if (this.channels.has(channelHandle)) {
            for (const [id, video] of this.channels.get(channelHandle).videoDetails) {
                if (video.isLive) {
                    liveDetails.push(video);
                }
            }
        } else {
            console.warn(`YouTube Channel ${channelHandle} is not being tracked!`);
        }
        return liveDetails;
    }

    async scanAndNotify() {
        /**
         * Indexed by video ID, value is channel handle
         * @type {Map<string, string>}
        */
        const videosToSearch = new Map();
        // for every tracked channel...
        for (const [handle, tracker] of this.channels) {
            // get updated video list for the channel
            const videos = await this.client.getRecentVideoList(tracker.channelId);
            // console.log(`Found videos for channel ${key}: ${videos.map(v => v.id)}`);
            for (const video of videos) {
                // populate global map of video ids, linking them to their corresponding channels
                // (this will be used for batching against the YouTube API quota in the next step)
                videosToSearch.set(video.id, tracker.channelHandle);
            }
        }
        const videoIds = [...videosToSearch.keys()]
        const videoDetails = await this.client.getVideoListDetails(videoIds);
        // process results
        for (const detail of videoDetails) {
            const originalHandle = videosToSearch.get(detail.id);
            const trackedChannel = this.channels.get(originalHandle);
            // if the video comes back as being Live, and we either have no record of it or have a record of it NOT being live, 
            // that means it has become live, so we want to act.
            const isNewlyLive = detail.isLive
                && (!trackedChannel.videoDetails.has(detail.id)
                    || !trackedChannel.videoDetails.get(detail.id).isLive);
            // update the detail record
            trackedChannel.videoDetails.set(detail.id, detail);
            if (isNewlyLive) {
                console.log(`Handling OnLive callback for YouTube Channel ${originalHandle} with video: ${detail.id}`);
                // invoke the OnLive callback for the corresponding channel
                for (const [callbackId, onLive] of trackedChannel.onLive) {
                    onLive(detail);
                }
            }
        }
    }
}

module.exports.YouTubeTracker = YouTubeTracker;