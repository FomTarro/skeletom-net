const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const { TemplateMap } = require('../utils/template.map');
const { PostData } = require('./convert.markdown.usecase');

/**
 * 
 * @param {TemplateMap} templateMap 
 * @param {string} content 
 * @returns {Promise<string>} HTML
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
 * @param {PostData[]} projects
 * @returns {Promise<string>} HTML
 */
async function generateHomePage(blogs, projects, templateMap){
    const template = templateMap.HOMEPAGE;
    const dom = new JSDOM(template);
    for(let i = 0; (i < blogs.length && i < 3); i++){
        dom.window.document.querySelector('#latest-blogs').innerHTML += await generateThumbnailBlogPost(blogs[i], templateMap);
    }
    for(const counter of dom.window.document.querySelectorAll('.blogs-total')){
        counter.innerHTML = blogs.length;
    }

    for(let i = 0; (i < projects.length && i < 3); i++){
        dom.window.document.querySelector('#latest-projects').innerHTML += await generateThumbnailBlogPost(projects[i], templateMap);
    }
    for(const counter of dom.window.document.querySelectorAll('.projects-total')){
        counter.innerHTML = projects.length;
    }

    return await embedContentInFrame(templateMap, dom.serialize());
}

/**
 * @param {PostData} post - This post.
 * @param {string} template - Template HTML
 * @param {TemplateMap} templateMap - Map of other Template paths.
 * @returns {Promise<string>} - Modified HTML 
 */
async function embedPostInTemplate(post, template, templateMap){
    const dom = new JSDOM(template);

    const caption = dom.window.document.querySelector('#post-caption');
    if(caption){
        if(post.caption){
            caption.innerHTML = post.caption
        }else{
            caption.remove();
        }
    }

    const brief = dom.window.document.querySelector('#post-brief');
    if(brief){
        brief.innerHTML = post.brief;
    }

    const release = dom.window.document.querySelector('#post-release');
    if(release){
        if(post.release){
            release.href = post.release
        }else{
            release.remove();
        }
    }

    const content = dom.window.document.querySelector('#post-content');
    if(content){
        content.innerHTML += post.html;
    }

    // fill in content
    for(const title of dom.window.document.querySelectorAll('.meta-title')){
        title.content = post.fullTitle;
        title.innerHTML = post.fullTitle;
    }
    for(const desc of dom.window.document.querySelectorAll('.meta-desc')){
        desc.content = post.brief
        desc.innerHTML = post.brief
    }
    for(const date of dom.window.document.querySelectorAll('.meta-date')){
        date.content = post.date;
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        date.innerHTML = new Date(post.date).toLocaleDateString("en-US", options);
    }
    if(post.date !== post.updated){
        for(const date of dom.window.document.querySelectorAll('.meta-updated')){
            date.content = post.updated;
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            date.innerHTML = `${new Date(post.updated).toLocaleDateString("en-US", options)}`;
        }
    }
    for(const img of dom.window.document.querySelectorAll('.meta-img')){
        img.content = post.thumbnail;
        img.src = post.thumbnail;
    }
    for(const link of dom.window.document.querySelectorAll('.meta-self-link')){
        link.href = `/${post.classification}/${post.title}`;
    }

    // tags
    const tags = dom.window.document.querySelector('.tags')
    if(tags){
        for(let i = 0; i < post.tags.length; i++){
            const tag = post.tags[i]
            const anchor = dom.window.document.createElement('a');
            anchor.href = `/${post.classification}?tags=${encodeURIComponent(tag)}`;
            anchor.innerHTML = tag;
            tags.append(anchor);
            if(post.tags[i+1]){
                const span = dom.window.document.createElement('span');
                span.innerHTML = " | ";
                span.classList.add("regular");
                tags.append(span);   
            }     
        }
    }

    // TODO: this section is absolutely going to be a kludge
    // Refactor it when you have a moment to breathe.
    // It should probably just be a separate template
    if(dom.window.document.querySelector('#key-information')){
        if(post.classification === "blogs"){
                dom.window.document.querySelector('#key-information').remove();
        }else{
            dom.window.document.querySelector("#key-information-initial-release").innerHTML = post.date ? new Date(post.date).toDateString() : "N/A";
            dom.window.document.querySelector("#key-information-latest-release").innerHTML = post.updated ? new Date(post.updated).toDateString() : "N/A";
            dom.window.document.querySelector("#key-information-version").innerHTML = post.version ? post.version : "N/A";
            dom.window.document.querySelector("#key-information-platforms").innerHTML = post.platforms ? post.platforms : "N/A";
            dom.window.document.querySelector("#key-information-link").innerHTML = post.release ? post.release : "N/A";
            dom.window.document.querySelector("#key-information-link").href = post.release ? post.release : "";
        }
    }

    if(dom.window.document.querySelector('#related-posts')){
        for(const classification of dom.window.document.querySelectorAll('.related-classification')){
            classification.innerHTML = post.classification === "blogs" ? "Projects" : "Blogs Posts";
        }
        if(post.related.length > 0){
            for(const relatedPost of post.related){
                const newerThumbnail = await generateThumbnailBlogPost(relatedPost, templateMap);
                dom.window.document.querySelector('#related-posts').innerHTML += newerThumbnail;
            }
            for(const counter of dom.window.document.querySelectorAll('.related-posts-total')){
                counter.innerHTML = post.related.length;
            }
            if(post.classification === "blogs"){
                // if this is a blog post, we find related projects by their names in our tags
                dom.window.document.querySelector('#related-all').href = `/projects?tags=${post.related.map(project => project.title).join(',')}`;
            }else{
                // if this is a project, we find related blog posts by our name in their tags
                dom.window.document.querySelector('#related-all').href = `/blogs?tags=${post.title}`;
            }
        }else {
            dom.window.document.querySelector('#related-posts').classList.add('top-padding');
            dom.window.document.querySelector('#related-posts').innerHTML = "No related content found :("
        }
    }

    // nav links
    if(dom.window.document.querySelector('#newer-post')){
        if(post.newer){
            const newerThumbnail = await generateThumbnailBlogPost(post.newer, templateMap);
            for(const link of dom.window.document.querySelectorAll('.newer-post-link')){
                link.href = `/${post.classification}/${post.newer.title}`
            }
            dom.window.document.querySelector('#newer-post').innerHTML = newerThumbnail;
        }else{
            dom.window.document.querySelector('#newer-post').parentElement.remove();
            dom.window.document.querySelector('.other-posts').classList.add("justify-right");
        }
    }
    if(dom.window.document.querySelector('#older-post')){
        if(post.older){
            const olderThumbnail = await generateThumbnailBlogPost(post.older, templateMap);
            for(const link of dom.window.document.querySelectorAll('.older-post-link')){
                link.href = `/${post.classification}/${post.older.title}`
            }
            dom.window.document.querySelector('#older-post').innerHTML = olderThumbnail;
        }else{
            dom.window.document.querySelector('#older-post').parentElement.remove();
            dom.window.document.querySelector('.other-posts').classList.add("justify-left");
        }
    }

    return dom.serialize();
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generateFullBlogPost(post, templateMap){
    // We involve the outer frame here so that it can 
    // get its meta tags updated in the same sweep
    const frame = await embedContentInFrame(templateMap, templateMap.BLOG_ITEM_FULL);
    return await embedPostInTemplate(post, frame, templateMap);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generatePreviewBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_PREVIEW, templateMap);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generateMinimalBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_MINIMAL, templateMap);
}

/**
 * 
 * @param {PostData} post 
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generateThumbnailBlogPost(post, templateMap){
    return await embedPostInTemplate(post, templateMap.BLOG_ITEM_THUMBNAIL, templateMap);
}

/**
 * 
 * @param {PostData[]} blogs - List of all Blogs that we want to display.
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generateBlogArchive(blogs, templateMap){
    const dom = new JSDOM(await embedContentInFrame(templateMap, templateMap.BLOG_ARCHIVE_CONTAINER));
    if(blogs.length > 0){
        const counts = {};
        for(let i = 0; i < blogs.length; i++){
            const post = await generatePreviewBlogPost(blogs[i], templateMap);
            dom.window.document.querySelector('#list').innerHTML += post;
            for(const tag of blogs[i].tags){
                counts[tag] = counts[tag] ? counts[tag] + 1 : 1;
            }
        }

        const map = Object.entries(counts).sort((a, b) => {
            if(a[0] < b[0]) { return -1; }
            if(a[0] > b[0]) { return 1; }
            return 0;
        }).sort((a, b) => {
            return b[1] - a[1]
        });

        const tagsList = dom.window.document.getElementById("common-tags-list");
        for(const [key, value] of map){
            const li = dom.window.document.createElement('li')
            const anchor = dom.window.document.createElement('a');
            li.append(anchor);
            anchor.href = `/${blogs[0].classification}?tags=${encodeURIComponent(key)}`;
            anchor.innerHTML = `${key}`;
            const span = dom.window.document.createElement('span');
            span.innerHTML = ` | ${value}`;
            span.classList.add("regular")
            li.append(span);
            tagsList.append(li);    
        }
    }else{
    dom.window.document.querySelector('#list').innerHTML = templateMap.BLOG_NO_RESULTS_ALERT;

    }
    return dom.serialize();
}

/**
 * 
 * @param {PostData} project 
 * @param {PostData[]} blogs 
 * @param {TemplateMap} templateMap 
 * @returns {Promise<string>} HTML
 */
async function generateFullProjectPost(project, blogs, templateMap){
    // We involve the outer frame here so that it can 
    // get its meta tags updated in the same sweep
    const frame = await embedContentInFrame(templateMap, templateMap.PROJECT_ITEM_FULL);
    return await embedPostInTemplate(project, frame, templateMap);
}

module.exports.GenerateHomePage = generateHomePage;
module.exports.GenerateFullBlogPost = generateFullBlogPost;
module.exports.GenerateBlogArchive = generateBlogArchive;
module.exports.GenerateFullProjectPost = generateFullProjectPost;