const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const fs = require('fs');
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

/**
 * A Blog/Project Post data structure
 * @typedef {Object} PostData
 * @property {string} title - The URL-formatted title.
 * @property {string} fullTitle - Unmodified title as originally written in the markdown.
 * @property {string} brief - The description/summary of the post.
 * @property {string[]} tags - The search tags that this Post is filed under.
 * @property {number} date - The date timestamp, as a number.
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

/**
 * 
 * @param {PostData} newerMetadata - A newer post.
 * @param {PostData} olderMetadata - An older post.
 * @param {PostData} metadata - This post.
 * @param {string} templatePath - Path to the template HTML. 
 * @returns {string} - Modified HTML 
 */
async function embedPostInTemplate(newerMetadata, olderMetadata, metadata, templatePath){
    const template = fs.readFileSync(templatePath).toString();
    const dom = new JSDOM(template);
    console.log(metadata);
    for(const title of dom.window.document.querySelectorAll('.meta-title')){
        title.content = metadata.fullTitle;
        title.innerHTML = metadata.fullTitle;
    }
    for(const desc of dom.window.document.querySelectorAll('.meta-desc')){
        desc.content = metadata.brief
        desc.innerHTML = metadata.brief
    }
    for(const date of dom.window.document.querySelectorAll('.meta-date')){
        date.content = metadata.date;
        date.innerHTML = metadata.date;
    }
    for(const img of dom.window.document.querySelectorAll('.meta-img')){
        img.content = metadata.thumbnail;
        img.src = metadata.thumbnail;
    }
    for(let i = 0; i < metadata.tags.length; i++){
        const tag = metadata.tags[i]
        const anchor = dom.window.document.createElement('a');
        anchor.href = `/blogs?tags=${tag}`;
        anchor.innerHTML = tag;
        dom.window.document.querySelector('.tags').append(anchor);
        if(metadata.tags[i+1]){
            const span = dom.window.document.createElement('span');
            span.innerHTML = " | ";
            span.classList.add("regular");
            dom.window.document.querySelector('.tags').append(span);   
        }     
    }

    // Links at bottom

    if(newerMetadata){
        for(const link of dom.window.document.querySelectorAll('.newer-post-link')){
            link.href = `/blogs/${newerMetadata.title}`
        }
        dom.window.document.querySelector('#newer-post-title').innerHTML = newerMetadata.fullTitle;
        if(newerMetadata.thumbnail){
            dom.window.document.querySelector('#newer-post-img').src = newerMetadata.thumbnail;
        }else{
            dom.window.document.querySelector('#newer-post-img').remove();
        }
    }else{
        dom.window.document.querySelector('#newer-post').remove();
        dom.window.document.querySelector('.other-posts').classList.add("justify-right");
    }

    if(olderMetadata){
        for(const link of dom.window.document.querySelectorAll('.older-post-link')){
            link.href = `/blogs/${olderMetadata.title}`
        }
        dom.window.document.querySelector('#older-post-title').innerHTML = olderMetadata.fullTitle;
        if(olderMetadata.thumbnail){
            dom.window.document.querySelector('#older-post-img').src = olderMetadata.thumbnail;
        }else{
            dom.window.document.querySelector('#older-post-img').remove();
        }
    }else{
        dom.window.document.querySelector('#older-post').remove();
        dom.window.document.querySelector('.other-posts').classList.add("justify-left");
    }
    dom.window.document.querySelector('#content').innerHTML = metadata.html;
    return dom.serialize();
}

function slugify(title) {
    return title
      .trim()
      .replace(/ +/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
}

module.exports.GetPostMetadata = getMetadata;
module.exports.EmbedPostInTemplate = embedPostInTemplate;
module.exports.PostData = this.PostData;