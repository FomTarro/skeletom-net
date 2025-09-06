const fs = require('fs');
const path = require('path');

/**
 * A map of templates to their string contents
 */
class TemplateMap {
    get FRAME(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'frame.html'))};
    
    get HOMEPAGE(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'homepage.content.html'))};
    
    get BLOG_ITEM_FULL(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blog.item.full.html'))};
    get BLOG_ITEM_PREVIEW(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blog.item.preview.html'))};
    get BLOG_ITEM_MINIMAL(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blog.item.minimal.html'))};
    get BLOG_ITEM_THUMBNAIL(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blog.item.thumbnail.html'))};
    get BLOG_NO_RESULTS_ALERT(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blog.no.results.html'))};
    get BLOG_ARCHIVE_CONTAINER(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'blogs.list.html'))};

    get PROJECT_ITEM_FULL(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'project.item.full.html'))};

    get NOT_FOUND() { return fs.readFileSync(path.join(__dirname, '..', 'templates', 'not.found.html')) };

    get FILE_LIST() { return fs.readFileSync(path.join(__dirname, '..', 'templates', 'file.list.full.html')) };
    
    get RSS(){ return fs.readFileSync(path.join(__dirname, '..', 'templates', 'rss.xml'))};
}

module.exports.TemplateMap = TemplateMap;