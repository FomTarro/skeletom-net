const { TwitchClient } = require("../twitch.client");
const { VideoDetail } = require("../video.detail");
const { TrackedChannel, OnLiveCallback } = require('./tracked.channel');

class TwitchTracker {
    /**
     * 
     * @param {TwitchClient} client 
     */
    constructor(client){
        this.client = client;
        /**
         * Indexed by login name
         * @type {Map<string, TrackedChannel>}
         */
        this.channels = new Map();
    }

    start() {
        this.stop();
        this.interval = setInterval(this.scanAndNotify.bind(this), 30*1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    getTrackedChannelList(){
        return [...this.channels.keys()];
    }

    /**
     * 
     * @param {string} userLogin 
     * @param {string} callbackId
     * @param {OnLiveCallback} onLive - Callback executed when a stream is detected as finally going live.
     */
    async trackChannel(userLogin, callbackId, onLive) {
        if (!this.channels.has(userLogin)) {
            this.channels.set(userLogin, new TrackedChannel(0, userLogin));
            console.log(`Now tracking Twitch Channel ${userLogin}`);
        } 
        console.log(`Adding callback with ID ${callbackId} for Twitch Channel ${userLogin}`);
        this.channels.get(userLogin).addOnLiveCallback(callbackId, onLive);
    }

    /**
     * 
     * @param {string} userLogin 
     * @param {string} callbackId
     */
    async untrackChannel(userLogin, callbackId) {
        if (this.channels.has(userLogin)) {
            console.log(`Removing callback with ID ${callbackId} for Twitch Channel ${userLogin}`);
            this.channels.get(userLogin).removeOnLiveCallback(callbackId);
            if(this.channels.get(userLogin).onLive.size <= 0) {
                this.channels.delete(userLogin);
                console.log(`All callbacks removed, no longer tracking Twitch Channel ${userLogin}`);
            }
        } else {
            console.warn(`Twitch Channel ${userLogin} was not being tracked!`);
        }
    }

    /**
     * 
     * @param {string} userLogin 
     * @returns {Promise<VideoDetail[]>}
     */
    async getCurrentlyLiveForChannel(userLogin) {
        const liveDetails = []
        if (this.channels.has(userLogin)) {
            for (const [id, video] of this.channels.get(userLogin).videoDetails) {
                if (video.isLive) {
                    liveDetails.push(video);
                }
            }
        } else {
            console.warn(`Twitch Channel ${userLogin} is not being tracked!`);
        }
        return liveDetails;
    }

    async scanAndNotify() {
        const channelNames = [...this.channels.keys()];
        const channelDetails = await this.client.getChannelListDetails(channelNames);
        for(const detail of channelDetails){
            const trackedChannel = this.channels.get(detail.channel);
            if(trackedChannel){
                const isNewlyLive = detail.isLive
                    && (!trackedChannel.videoDetails.has(detail.channel)
                        || !trackedChannel.videoDetails.get(detail.channel).isLive);
                 // update the detail record, 
                 // for Twitch we can just index by channel handle, since it's a list of 1 element.
                trackedChannel.videoDetails.set(detail.channel, detail);
                if (isNewlyLive) {
                    console.log(`Handling OnLive callback for Twitch Channel ${trackedChannel.channelHandle}`);
                    // invoke the OnLive callback for the corresponding channel
                    for(const [trackerId, onLive] of trackedChannel.onLive){
                        onLive(detail);
                    }
                }
            }
        }
    }
    
}

module.exports.TwitchTracker = TwitchTracker;