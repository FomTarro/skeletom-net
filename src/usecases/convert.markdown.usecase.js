const { AppConfig } = require("../../app.config");
const showdown = require('showdown');
const fs = require('fs');
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

/**
 * @param {string} markdownPath
 * @param {AppConfig} appConfig 
 * @returns {string} HTML
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
    dom.window.document.querySelector('#content').innerHTML = html;
    for(const tag of tags){
        const anchor = dom.window.document.createElement('a');
        anchor.href = `/blogs?tags=${tag}`;
        anchor.innerHTML = tag;
        dom.window.document.querySelector('.tags').append(anchor);
    }
    return {
        title: slugify(metadata['title']),
        html: dom.serialize(),
        metadata
    }
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

module.exports.ConvertMarkdown = usecase;