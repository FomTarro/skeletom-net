const fs = require('fs');
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

async function embedInFrame(templatePath, contentPath, appConfig){
    const template = fs.readFileSync(templatePath).toString();
    const dom = new JSDOM(template);
    const content = fs.readFileSync(contentPath).toString();
    dom.window.document.getElementById('body').innerHTML = content;
    return dom.serialize();
}

module.exports.EmbedInFrame = embedInFrame;