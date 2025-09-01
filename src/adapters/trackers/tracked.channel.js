const { LRUMap } = require("../../utils/lru.map");
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
     * @param {OnLiveCallback} onLive 
     */
    constructor(channelId, channelHandle, onLive) {
        this.channelId = channelId;
        this.channelHandle = channelHandle;
        this.onLive = onLive;
        /**
         * Indexed by video ID
         * @type {Map<string, VideoDetail>}
         */
        this.videoDetails = new LRUMap(100);
    }
}

module.exports.TrackedChannel = TrackedChannel;