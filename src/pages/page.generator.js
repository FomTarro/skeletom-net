const { AppConfig } = require("../../app.config");
const { PostData } = require("../usecases/convert.markdown.usecase");
const { TemplateMap } = require("./template.map");
const { JSDOM } = require('jsdom')

class PageGenerator {
    /**
     * 
     * @param {AppConfig} appConfig 
     * @param {TemplateMap} templateMap 
     */
    constructor(appConfig, templateMap) {
        this.domain = appConfig.DOMAIN;
        this.templateMap = templateMap;
    }

    /**
     * Generates an RSS document including the provided list of posts.
     * @param {PostData[]} posts 
     * @returns 
     */
    async generateRSS(posts) {
        const template = this.templateMap.RSS;
        const dom = new JSDOM(template, { contentType: "text/xml" });
        const doc = dom.window.document
        const link = doc.getElementsByTagName("link")[0];
        link.innerHTML = this.domain;
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
            link.innerHTML = `${this.domain}/${post.classification}/${post.title}`;
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

    /**
     * Embeds a token in a form to let users copy it to clipboard while remaining hidden.
     * @param {string} token 
     * @returns 
     */
    async embedToken(token) {
        const dom = new JSDOM(this.templateMap.TOKEN);
        const doc = dom.window.document;
        if (token) {
            doc.getElementById('auth-token').value = `${token}`;
        }else{
            doc.getElementById('auth-token-copy-field').remove();
            const err = doc.createElement('div');
            err.id = "error";
            err.innerHTML = "Unable to generate auth token! Please contact Tom via email: tom@skeletom.net."
            doc.getElementById('content').append(err);
        }
        return dom.serialize();
    }
}

module.exports.PageGenerator = PageGenerator;