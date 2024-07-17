const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const { TemplateMap } = require('../utils/template.map');
const { PostData } = require('./convert.markdown.usecase');

/**
 * 
 * @param {TemplateMap} templateMap 
 * @param {string} content 
 * @returns {string} HTML
 */
async function embedContentInFrame(templateMap, content){
    const template = templateMap.FRAME;
    const dom = new JSDOM(template);
    dom.window.document.getElementById('body').innerHTML = content;
    return dom.serialize();
}

/**
 * 
 * @param {TemplateMap} templateMap 
 * @param {PostData[]} blogs
 * @returns {string} HTML
 */
async function generateHomePage(blogs, templateMap){
    const template = templateMap.HOMEPAGE;
    const dom = new JSDOM(template);
    for(let i = 0; (i < blogs.length && i < 3); i++){
        dom.window.document.querySelector('#latest-blogs').innerHTML += await generateThumbnailBlogPost(blogs[i], templateMap);
    }
    for(const counter of dom.window.document.querySelectorAll('.blogs-total')){
        counter.innerHTML = blogs.length;
    }
    return await embedContentInFrame(templateMap, dom.serialize());
}

/**
 * @param {PostData} metadata - This post.
 * @param {string} template - Template HTML
 * @returns {string} - Modified HTML 
 */
async function embedPostInTemplate(metadata, template){
    const dom = new JSDOM(template);
    const content = dom.window.document.querySelector('#post-content');
    if(content){
        content.innerHTML = metadata.html;
    }

    // fill in content
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
    for(const link of dom.window.document.querySelectorAll('.meta-self-link')){
        link.href = `/blogs/${metadata.title}`;
    }

    // tags
    const tags = dom.window.document.querySelector('.tags')
    if(tags){
        for(let i = 0; i < metadata.tags.length; i++){
            const tag = metadata.tags[i]
            const anchor = dom.window.document.createElement('a');
            anchor.href = `/blogs?tags=${tag}`;
            anchor.innerHTML = tag;
            tags.append(anchor);
            if(metadata.tags[i+1]){
                const span = dom.window.document.createElement('span');
                span.innerHTML = " | ";
                span.classList.add("regular");
                tags.append(span);   
            }     
        }
    }

    // nav links
    if(dom.window.document.querySelector('#newer-post')){
        if(metadata.newer){
            for(const link of dom.window.document.querySelectorAll('.newer-post-link')){
                link.href = `/blogs/${metadata.newer.title}`
            }
            dom.window.document.querySelector('#newer-post-title').innerHTML = metadata.newer.fullTitle;
            if(metadata.newer.thumbnail){
                dom.window.document.querySelector('#newer-post-img').src = metadata.newer.thumbnail;
            }else{
                dom.window.document.querySelector('#newer-post-img').remove();
            }
        }else{
            dom.window.document.querySelector('#newer-post').remove();
            dom.window.document.querySelector('.other-posts').classList.add("justify-right");
        }
    }

    if(dom.window.document.querySelector('#older-post')){
        if(metadata.older){
            for(const link of dom.window.document.querySelectorAll('.older-post-link')){
                link.href = `/blogs/${metadata.older.title}`
            }
            dom.window.document.querySelector('#older-post-title').innerHTML = metadata.older.fullTitle;
            if(metadata.older.thumbnail){
                dom.window.document.querySelector('#older-post-img').src = metadata.older.thumbnail;
            }else{
                dom.window.document.querySelector('#older-post-img').remove();
            }
        }else{
            dom.window.document.querySelector('#older-post').remove();
            dom.window.document.querySelector('.other-posts').classList.add("justify-left");
        }
    }

    return dom.serialize();
}

/**
 * 
 * @param {PostData} current 
 * @param {PostData} newer 
 * @param {PostData} older 
 * @param {TemplateMap} templateMap 
 * @returns {string} HTML
 */
async function generateFullBlogPost(current, templateMap){
    // We involve the outer frame here so that it can get its meta tags updated in the same sweep
    const frame = await embedContentInFrame(templateMap, templateMap.BLOG_ITEM_FULL);
    return await embedPostInTemplate(current, frame);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns 
 */
async function generatePreviewBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_PREVIEW);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns 
 */
async function generateMinimalBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_MINIMAL);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns 
 */
async function generateThumbnailBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_THUMBNAIL);
}

/**
 * 
 * @param {PostData[]} blogs - List of all Blogs
 * @param {TemplateMap} templateMap 
 * @returns {string} HTML
 */
async function generateBlogArchive(blogs, templateMap){
    const dom = new JSDOM(await embedContentInFrame(templateMap, templateMap.BLOG_ARCHIVE_CONTAINER));
    for(let i = 0; i < blogs.length; i++){
        if(i == 0){
            const firstPost = await generatePreviewBlogPost(blogs[i], templateMap);
            dom.window.document.querySelector('#list').innerHTML += firstPost;
        }else{
            const post = await generateMinimalBlogPost(blogs[i], templateMap);
            dom.window.document.querySelector('#list').innerHTML += post
        }
    }
    if(blogs.length <= 0){
        dom.window.document.querySelector('#list').innerHTML = templateMap.BLOG_NO_RESULTS_ALERT;
    }
    return dom.serialize();
}

module.exports.GenerateHomePage = generateHomePage;
module.exports.GenerateFullBlogPost = generateFullBlogPost;
module.exports.GenerateBlogArchive = generateBlogArchive;