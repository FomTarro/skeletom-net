const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const fs = require('fs');

/**
 * A Blog/Project Post data structure
 * @typedef {Object} PostData
 * @property {string} title - The URL-formatted title.
 * @property {string} fullTitle - Unmodified title as originally written in the markdown.
 * @property {string} brief - The description/summary of the post.
 * @property {string[]} tags - The search tags that this Post is filed under.
 * @property {number} date - The date timestamp, as a number.
 * @property {PostData} newer - The next newest Post of this type.
 * @property {PostData} older - The next oldest Post of this type.
 * @property {string} thumbnail - The absolute URL of the thumbnail image
 * @property {string} html - The HTML of the post page.
 */

/**
 * @param {string} templatePath
 * @param {string} markdownPath
 * @param {AppConfig} appConfig 
 * @returns {PostData} Post data
 */
async function getMetadata(markdownPath, appConfig){
    // TODO: have this return a full-page and a preview
    const markdown = fs.readFileSync(markdownPath).toString();
    const converter = new showdown.Converter({
        parseImgDimensions: true,
        metadata: true
    });
    const html = converter.makeHtml(markdown);
    const metadata = converter.getMetadata();
    const tags = metadata['tags'].split(',').map(tag => tag.trim().toLowerCase());
    const timestamp = new Date(Date.parse(metadata['date'])).toDateString();
    return {
        title: slugify(metadata['title']),
        fullTitle: metadata['title'],
        brief: metadata['brief'],
        tags,
        date: timestamp,
        thumbnail: `${appConfig.DOMAIN}${metadata['thumb']}`,
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