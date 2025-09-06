const { AWSClient } = require("../adapters/aws.client");

class HitCounter {
    /**
     * 
     * @param {AWSClient} awsClient 
     */
    constructor(awsClient){
        this.awsClient = awsClient;
        // key: path, value: list of user ids
        this.userMap = new Map();
    }

    start() {
        // clear user map every 30 minutes
        this.interval = setInterval(() => {
            this.userMap.clear();
        }, 15 * 60 * 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    /**
     * Gets the number of lifetime hits for a given path.
     * @param {string} path - URL path, not including query parameters.
     * @returns {Promise<number>} - The number of hits on that page.
     */
    async getHitCountForPath(path){
        const results = await this.awsClient.getFromTable(path);
        return results;
    }

    /**
     * Increments the number of lifetime hits for a given path.
     * @param {string} path - URL path, not including query parameters.
     * @param {string} userId - User ID, used to prevent the same user from counting as a page veiw multiple times in quick succession.
     */
    async incrementHitCountForPath(path, userId,){
        if(!this.userMap.has(path)){
            this.userMap.set(path, []);
        }
        if(!this.userMap.get(path).includes(userId)){
            // only increment the hit count if the user hasn't been here recently
            this.awsClient.incrementFromTable(path);
            this.userMap.get(path).push(userId);
        }
    }
}

module.exports.HitCounter = HitCounter;