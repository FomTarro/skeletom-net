const { GetFromTable, IncrementFromTable} = require('../adapters/aws.client');

// key: path, value: list of user ids
const userMap = new Map();

/**
 * Gets the number of lifetime hits for a given path.
 * @param {string} path - URL path, not including query parameters.
 * @param {AppConfig} appConfig
 * @returns {Promise<number>} - The number of hits on that page.
 */
async function getHitCountForPath(path, appConfig){
    const results = await GetFromTable(path, appConfig);
    return results;
}

/**
 * Increments the number of lifetime hits for a given path.
 * @param {string} path - URL path, not including query parameters.
 * @param {string} userId - User ID, used to prevent the same user from counting as a page veiw multiple times in quick succession.
 * @param {AppConfig} appConfig
 */
async function incrementHitCountForPath(path, userId, appConfig){
    if(!userMap.has(path)){
        userMap.set(path, []);
    }
    if(!userMap.get(path).includes(userId)){
        // only increment the hit count if the user hasn't been here recently
        IncrementFromTable(path, appConfig);
        userMap.get(path).push(userId);
    }
}

// clear user map every 30 minutes
setInterval(() => {
    userMap.clear();
}, 15 * 60 * 1000);

module.exports.GetHitCountForPath = getHitCountForPath;
module.exports.IncrementHitCountForPath = incrementHitCountForPath;