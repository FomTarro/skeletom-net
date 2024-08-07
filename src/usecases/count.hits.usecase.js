const { GetFromTable, IncrementFromTable} = require('../adapters/aws.client');

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
 * @param {AppConfig} appConfig
 */
async function incrementHitCountForPath(path, appConfig){
    IncrementFromTable(path, appConfig);
}

module.exports.GetHitCountForPath = getHitCountForPath;
module.exports.IncrementHitCountForPath = incrementHitCountForPath;