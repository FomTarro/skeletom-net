const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const path = require('path');
const fs = require('fs');

/**
 * A Blog/Project Post data structure
 * @typedef {Object} PostData
 * @property {string} title - The URL-formatted title.
 * @property {string} fullTitle - Unmodified title as originally written in the markdown.
 * @property {"blogs"|"projects"} classification - What kind of post is this? Should be either "blogs" or "projects". 
 * @property {string} brief - The description/summary of the post.
 * @property {string[]} tags - The search tags that this Post is filed under.
 * @property {number} date - The date timestamp, as a number.
 * @property {number} updated - The updated timestamp, as a number. Same as date if never updated.
 * @property {PostData} newer - The next newest Post of this type.
 * @property {PostData} older - The next oldest Post of this type.
 * @property {PostData[]} related - Related posts.
 * @property {string} thumbnail - The absolute URL of the thumbnail image.
 * @property {string} caption - The optional caption for the post thumbnail.
 * @property {string} release - The absolute URL of the release link for the item.
 * @property {string} version - The release version of the item.
 * @property {string} platforms - The list of platforms. (TODO: these should work as tags, too?)
 * @property {string} html - The HTML of the post page.
 */

/**
 * List of all blog posts, sorted by newest first
 * @type {PostData[]}
 */
const blogs = [];
const BLOGS_PATH = path.join(__dirname, '..', 'pages', 'blogs');

/**
 * List of all project posts, sorted by newest first
 * @type {PostData[]}
 */
const projects = [];
const PROJECTS_PATH = path.join(__dirname, '..', 'pages', 'projects');


/**
 * @param {string} markdownPath
 * @param {string} classification - "blogs" or "projects"
 * @param {AppConfig} appConfig 
 * @returns {Promise<PostData>} Post data
 */
async function getMetadata(markdownPath, classification, appConfig){
    const markdown = fs.readFileSync(markdownPath).toString();
    const converter = new showdown.Converter({
        parseImgDimensions: true,
        metadata: true,
    });
    const html = converter.makeHtml(markdown);
    const metadata = converter.getMetadata();
    const tags = metadata['tags'].split(',').map(tag => tag.trim().toLowerCase()).sort();
    const timestamp = Date.parse(`${metadata['date']}T00:00:00-05:00`) 
    const updated = metadata['updated'] ? Date.parse(`${metadata['updated']}T00:00:00-05:00`) : timestamp;
    return {
        title: slugify(metadata['title']),
        fullTitle: metadata['title'],
        classification: classification ? classification : "blogs",
        brief: metadata['brief'],
        tags,
        date: timestamp,
        updated,
        older: undefined,
        newer: undefined,
        related: [],
        thumbnail: `${appConfig.DOMAIN}${metadata['thumb']}`,
        caption: metadata['caption'],
        platforms: metadata['platforms'],
        release: metadata['release'],
        version: metadata['version'],
        html,
    }
}

/**
 * 
 * @param {AppConfig} appConfig 
 */
async function populatePostLists(appConfig){
    // blogs
    blogs.length = 0;
    for(const file of fs.readdirSync(BLOGS_PATH)){
        const blogInfo = await getMetadata(path.join(BLOGS_PATH, file), "blogs", appConfig);
        blogs.push(blogInfo);
    }
    // sorted newest to oldest
    blogs.sort((a, b) => b.updated - a.updated);

    // projects
    projects.length = 0;
    for(const file of fs.readdirSync(PROJECTS_PATH)){
        const projectInfo = await getMetadata(path.join(PROJECTS_PATH, file), "projects", appConfig);
        projects.push(projectInfo);
    }
    // sorted newest to oldest
    projects.sort((a, b) => b.updated - a.updated);

    for(let i = 0; i < blogs.length; i ++){
        blogs[i].newer = blogs[i-1];
        blogs[i].older = blogs[i+1];
    }

    for(let i = 0; i < projects.length; i ++){
        projects[i].newer = projects[i-1];
        projects[i].older = projects[i+1];
        projects[i].related = filterPosts(blogs, projects[i].fullTitle);
        for(let relatedBlog of projects[i].related){
            // link the relationship both ways
            relatedBlog.related.push(projects[i]);
        };
    }
}

/**
 * 
 * @param {PostData[]} posts - List of posts to filter.
 * @param {string} tags - Key word to filter by.
 * @returns {PostData[]} - Filtered set of posts
 */
function filterPosts(posts, tags){
    if(!tags || !posts){
        return [];
    }
    const splitTags = tags.toLowerCase().split(',').map(tag => tag.trim());

    // find all posts whos tags or words in title contain any of the tags from our comma separated list
    return posts.filter(post => splitTags.some(tag => 
    post.tags.filter(pt => pt.toLowerCase().includes(tag)).length > 0 
    || post.fullTitle.toLowerCase().includes(tag)))
    // return posts.filter(post => post.tags.filter(postTag => splitTags.includes(postTag.toLowerCase())).length > 0 
    // || post.fullTitle.split(' ').filter(word => splitTags.includes(word.toLowerCase())).length > 0
    // || splitTags.includes(post.title)
    // || );
}

// Utils
/**
 * Converts a string like "A Blog Post" into "a-blog-post"
 * @param {string} title - ex "A Blog Post"
 * @returns {string} ex "a-blog-post"
 */
function slugify(title) {
    return title
        .trim()
        .replace(/ +/g, '-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
}

// If we're running locally, spin up a set of watchers 
// to automatically refresh the content when we make edits
const APP_CONFIG = new AppConfig();
if(APP_CONFIG.DOMAIN.includes("localhost")){
    let fsTimeout;
    fs.watch(BLOGS_PATH, e => {
        try{
            populatePostLists(APP_CONFIG);
        }catch(e){

        }
        if(!fsTimeout){
            fsTimeout = setTimeout(() => { fsTimeout = undefined }, 500);
        }
    });
    fs.watch(PROJECTS_PATH, e => {
        try{
            populatePostLists(APP_CONFIG);
        }catch(e){
            
        }
        if(!fsTimeout){
            fsTimeout = setTimeout(() => { fsTimeout = undefined }, 500);
        }
    });
}

function PROJECTS(){ return projects; };
function BLOGS(){ return blogs; };

module.exports.PopulatePostLists = populatePostLists;
module.exports.GetPostMetadata = getMetadata;
module.exports.FilterPostMetadata = filterPosts;
module.exports.Blogs = BLOGS;
module.exports.Projects = PROJECTS;
module.exports.PostData = this.PostData;