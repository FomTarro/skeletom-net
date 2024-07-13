const { AppConfig } = require("../../app.config");
const fs = require('fs');
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const { PostData } = require('./convert.markdown.usecase');

async function usecase(templatePath, blogInfos, appConfig){
    const template = fs.readFileSync(templatePath).toString();
    const dom = new JSDOM(template);
    const listItemTemplate = dom.window.document.getElementById('list-item').content;
    console.log(listItemTemplate);
    for(let i = 0; i < blogInfos.length; i++){
        const info = blogInfos[i];
        if(i > 0){
            const clone = dom.window.document.importNode(listItemTemplate, true);
            populateItem(clone, info, dom);
            dom.window.document.querySelector('.column').appendChild(clone);
        }else{
            const clone = dom.window.document.querySelector('#latest-post');
            populateItem(clone, info, dom);
        }
    }

    return dom.serialize();
}

/**
 * 
 * @param {HTMLElement} item 
 * @param {PostData} info 
 * @param {jsdom.JSDOM} dom 
 */
function populateItem(item, info, dom){
    for(const title of item.querySelectorAll('.meta-title')){
        title.content = info.fullTitle
        title.innerHTML = info.fullTitle
    }
    for(const desc of item.querySelectorAll('.meta-desc')){
        desc.content = info.brief
        desc.innerHTML = info.brief
    }
    for(const date of item.querySelectorAll('.meta-date')){
        const timestamp = new Date(info.date).toDateString();
        date.content = timestamp;
        date.innerHTML = timestamp;
    }
    for(const link of item.querySelectorAll('.meta-link')){
        link.href = `/blogs/${info.title}`
    }
    for(const tag of info.tags){
        const anchor = dom.window.document.createElement('a');
        anchor.href = `/blogs?tags=${tag}`;
        anchor.innerHTML = tag;
        item.querySelector('.tags').append(anchor);
        const span = dom.window.document.createElement('span');
        span.innerHTML = " | ";
        span.classList.add("regular");
        item.querySelector('.tags').append(span);        
    }
}

module.exports.PopulateBlogsList = usecase;