const { LRUMap } = require("../../../utils/lru.map");
const { VideoDetail } = require("../video.detail");

/**
 * @callback OnLiveCallback
 * @param {VideoDetail} - Video Details about the Live stream.
 */

class TrackedChannel {
    /**
     * 
     * @param {string} channelId 
     * @param {string} channelHandle 
     */
    constructor(channelId, channelHandle) {
        this.channelId = channelId;
        this.channelHandle = channelHandle;
        /**
         * Indexed by video ID
         * @type {Map<string, OnLiveCallback>}
         */
        this.onLive = new Map();
        /**
         * Indexed by video ID
         * @type {Map<string, VideoDetail>}
         */
        this.videoDetails = new LRUMap(100);
    }

    /**
     * 
     * @param {string} callbackId 
     * @param {OnLiveCallback} onLive 
     */
    addOnLiveCallback(callbackId, onLive){
        this.onLive.set(callbackId, onLive)
    }

    /**
     * 
     * @param {string} callbackId 
     */
    removeOnLiveCallback(callbackId){
        if(this.onLive.has(callbackId)){
            this.onLive.delete(callbackId);
        }else{
            console.warn(`Tracker for channel ${this.channelHandle} does not contain a callback with ID ${callbackId}` )
        }
    }
}

module.exports.TrackedChannel = TrackedChannel;