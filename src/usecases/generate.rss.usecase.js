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

    posts.sort((a, b) => {
        a.updated - b.updated
    });
    const slice = posts.slice(0, 5);
    for (const post of slice) {
//         <item>
            // <title>Louisiana Students to Hear from NASA Astronauts Aboard Space Station</title>
            // <link>http://www.nasa.gov/press-release/louisiana-students-to-hear-from-nasa-astronauts-aboard-space-station</link>
            // <description>As part of the state's first Earth-to-space call, students from Louisiana will have an opportunity soon to hear from NASA astronauts aboard the International Space Station.</description>
            // <pubDate>Fri, 21 Jul 2023 09:04 EDT</pubDate>
            // <guid>http://www.nasa.gov/press-release/louisiana-students-to-hear-from-nasa-astronauts-aboard-space-station</guid>
        // </item>
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
        const lastBuildDate = doc.createElement("lastBuildDate");
        lastBuildDate.innerHTML = new Date(post.updated).toUTCString();
        item.appendChild(lastBuildDate);

        channel.appendChild(item);
        
    }
    const str = dom.serialize();
    return str;
}

module.exports.GenerateRSS = generateRSS;