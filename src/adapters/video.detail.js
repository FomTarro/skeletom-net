class VideoDetail {
    /**
     * 
     * @param {string} id 
     * @param {"Stream"} type 
     * @param {"Twitch"|"YouTube"} platform
     * @param {string} title 
     * @param {string} category
     * @param {string} url
     * @param {boolean} isLive 
     */
    constructor(id, type, platform, title, category, url, isLive) {
        this.id = id;
        this.type = type;
        this.platform = platform;
        this.title = title;
        this.category = category;
        this.url = url;
        this.isLive = isLive;
    }
}

module.exports.VideoDetail = VideoDetail;