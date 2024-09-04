const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const { TemplateMap } = require('../utils/template.map');
const { PostData } = require('../usecases/convert.markdown.usecase');

/**
 * @param {PostData[]} posts - My good posts.
 * @param {TemplateMap} templateMap - The map of templates.
 * @returns {Promise<string>} RSS
 */
async function generateRSS(posts, templateMap) {
    const template = templateMap.RSS;
    const dom = new JSDOM(template, {contentType: "text/xml"});
    const doc = dom.window.document
    const channel = doc.getElementsByTagName("channel")[0];
    const pubDate = doc.createElement("pubDate");
    pubDate.innerHTML = new Date().toUTCString();
    channel.appendChild(pubDate);
    const lastBuildDate = doc.createElement("lastBuildDate");
    lastBuildDate.innerHTML = new Date().toUTCString();
    channel.appendChild(lastBuildDate);

    posts.sort((a, b) => b.updated - a.updated);
    const slice = posts.slice(0, 5);
    for (const post of slice) {
        const item = doc.createElement("item");
        const title = doc.createElement("title");
        title.innerHTML = post.fullTitle;
        item.appendChild(title);

        const link = doc.createElement("link");
        link.innerHTML = `https://www.skeletom.net/${post.classification}/${post.title}`;
        item.appendChild(link);

        const desc = doc.createElement("description");
        desc.innerHTML = post.brief;
        item.appendChild(desc);

        const pubDate = doc.createElement("pubDate");
        pubDate.innerHTML = new Date(post.updated).toUTCString();
        item.appendChild(pubDate);

        const guid = doc.createElement("guid");
        guid.innerHTML = link.innerHTML;
        item.appendChild(guid);

        channel.appendChild(item);
        
    }
    const str = dom.serialize();
    return str;
}

module.exports.GenerateRSS = generateRSS;