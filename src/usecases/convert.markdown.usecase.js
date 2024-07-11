const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const fs = require('fs');
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

/**
 * @param {string} templatePath
 * @param {string} markdownPath
 * @param {AppConfig} appConfig 
 * @returns {object} HTML
 */
async function usecase(templatePath, markdownPath, appConfig){
    const markdown = fs.readFileSync(markdownPath).toString();
    const converter = new showdown.Converter({
        parseImgDimensions: true,
        metadata: true
    });
    const html = converter.makeHtml(markdown);
    const metadata = converter.getMetadata();
    const tags = metadata['tags'].split(',').map(tag => tag.trim().toLowerCase());
    const template = fs.readFileSync(templatePath).toString();
    const dom = new JSDOM(template);
    console.log(metadata);
    for(const title of dom.window.document.querySelectorAll('.meta-title')){
        title.content = metadata['title'];
        title.innerHTML = metadata['title'];
    }
    for(const desc of dom.window.document.querySelectorAll('.meta-desc')){
        desc.content = metadata['brief'];
        desc.innerHTML = metadata['brief'];
    }
    for(const date of dom.window.document.querySelectorAll('.meta-date')){
        const timestamp = new Date(Date.parse(metadata['date'])).toDateString();
        date.content = timestamp;
        date.innerHTML = timestamp;
    }
    // TODO: images
    for(let i = 0; i < tags.length; i++){
        const tag = tags[i]
        const anchor = dom.window.document.createElement('a');
        anchor.href = `/blogs?tags=${tag}`;
        anchor.innerHTML = tag;
        dom.window.document.querySelector('.tags').append(anchor);
        if(tags[i+1]){
            const span = dom.window.document.createElement('span');
            span.innerHTML = " | ";
            span.classList.add("regular");
            dom.window.document.querySelector('.tags').append(span);   
        }     
    }
    dom.window.document.querySelector('#content').innerHTML = html;
    // TODO: make classdef for this
    return {
        title: slugify(metadata['title']),
        tags,
        date: metadata.date,
        html: dom.serialize(),
        metadata
    }
}

async function insertNewerOlderLinks(newerMetadata, olderMetadata, pageHtml){
    const dom = new JSDOM(pageHtml);
    if(newerMetadata){
        dom.window.document.querySelector('#newer-post-link').href = `/blogs/${newerMetadata.title}`
        dom.window.document.querySelector('#newer-post-title').innerHTML = newerMetadata.metadata['title'];
        if(newerMetadata.metadata['thumb']){
            dom.window.document.querySelector('#newer-post-img').src = newerMetadata.metadata['thumb'];
        }else{
            dom.window.document.querySelector('#newer-post-img').remove();
        }
    }else{
        dom.window.document.querySelector('#newer-post').remove();
        dom.window.document.querySelector('.other-posts').classList.add("justify-right");
    }

    if(olderMetadata){
        dom.window.document.querySelector('#older-post-link').href = `/blogs/${olderMetadata.title}`
        dom.window.document.querySelector('#older-post-title').innerHTML = olderMetadata.metadata['title'];
        if(olderMetadata.metadata['thumb']){
            dom.window.document.querySelector('#older-post-img').src = olderMetadata.metadata['thumb'];
        }else{
            dom.window.document.querySelector('#older-post-img').remove();
        }
    }else{
        dom.window.document.querySelector('#older-post').remove();
        dom.window.document.querySelector('.other-posts').classList.add("justify-left");
    }
    return dom.serialize();
}

function slugify(title) {
    return title
      .trim()
      .replace(/ +/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
}

// function convertTimestamp(stamp){
//     var a = new Date(stamp * 1000);
//     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();
//     var hour = a.getHours();
//     var min = a.getMinutes();
//     var sec = a.getSeconds();
//     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
//     return time;
// }

module.exports.ConvertMarkdownToBlog = usecase;
module.exports.InsertOlderNewer = insertNewerOlderLinks;