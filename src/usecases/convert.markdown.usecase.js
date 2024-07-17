const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const fs = require('fs');

/**
 * A Blog/Project Post data structure
 * @typedef {Object} PostData
 * @property {string} title - The URL-formatted title.
 * @property {string} fullTitle - Unmodified title as originally written in the markdown.
 * @property {string} classification - What kind of post is this? Should be either "blogs" or "projects". 
 * @property {string} brief - The description/summary of the post.
 * @property {string[]} tags - The search tags that this Post is filed under.
 * @property {number} date - The date timestamp, as a number.
 * @property {number} updated - The updated timestamp, as a number. Same as date if never updated.
 * @property {PostData} newer - The next newest Post of this type.
 * @property {PostData} older - The next oldest Post of this type.
 * @property {string} thumbnail - The absolute URL of the thumbnail image.
 * @property {string} release - The absolute URL of the release link for the item.
 * @property {string} version - The release version of the item.
 * @property {string} html - The HTML of the post page.
 */

/**
 * @param {string} templatePath
 * @param {string} markdownPath
 * @param {AppConfig} appConfig 
 * @returns {PostData} Post data
 */
async function getMetadata(markdownPath, classification, appConfig){
    const markdown = fs.readFileSync(markdownPath).toString();
    const converter = new showdown.Converter({
        parseImgDimensions: true,
        metadata: true
    });
    const html = converter.makeHtml(markdown);
    const metadata = converter.getMetadata();
    const tags = metadata['tags'].split(',').map(tag => tag.trim().toLowerCase());
    const timestamp = new Date(Date.parse(metadata['date'])).toDateString();
    const updated = metadata['updated'] ? new Date(Date.parse(metadata['updated'])).toDateString() : timestamp;
    return {
        title: slugify(metadata['title']),
        fullTitle: metadata['title'],
        classification: classification ? classification : "blogs",
        brief: metadata['brief'],
        tags,
        date: timestamp,
        updated,
        thumbnail: `${appConfig.DOMAIN}${metadata['thumb']}`,
        link: metadata['release'],
        version: metadata['version'],
        html,
    }
}

// Utils
function slugify(title) {
    return title
      .trim()
      .replace(/ +/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
}

module.exports.GetPostMetadata = getMetadata;
module.exports.PostData = this.PostData;