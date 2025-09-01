const http = require('http');
const path = require('path');
const fs = require("fs");
const express = require('express');
const { AppConfig } = require('./app.config');
const { GetToken } = require('./src/usecases/get.token.usecase');
const { EmbedToken } = require('./src/usecases/embed.token.usecase');
const { WolframAsk } = require('./src/usecases/wolfram.ask.usecase');
const { GetCurrencyRates } = require('./src/usecases/currency.convert.usecase');
const { Blogs, Projects, FilterPostMetadata, PopulatePostLists, ProjectsPath, BlogsPath } = require('./src/usecases/convert.markdown.usecase');
const { GenerateHomePage, GenerateFullBlogPost, GenerateBlogArchive, GenerateNotFound, GenerateFileList } = require('./src/usecases/embed.html.usecase');
const { TemplateMap } = require('./src/utils/template.map');
const { GetChannelStatus } = require('./src/adapters/twitch.client');
const { GetHitCountForPath, IncrementHitCountForPath } = require('./src/usecases/count.hits.usecase');
const { GenerateRSS } = require('./src/usecases/generate.rss.usecase');
const { YouTubeClient } = require('./src/adapters/youtube.client');
const { YouTubeTracker } = require('./src/adapters/trackers/youtube.tracker');
const WebSocket = require('ws');

let LAST_STREAM_STATUS = {
    status: "OFFLINE",
    address: AppConfig.STREAM_URL
};
// check Twitch API every 10 seconds and cache the result
const STREAM_STATUS_POLLER = setInterval(async () => {
    const channelName = AppConfig.STREAM_URL.split('/').pop();
    const status = await GetChannelStatus(channelName, AppConfig);
    LAST_STREAM_STATUS = {
        status: status.status,
        address: AppConfig.STREAM_URL,
        channel: channelName,
        title: status.title,
        game: status.game
    }
}, 10000);

const app = express();

async function createHttpRoutes(){
    const baseDirectory = path.join(__dirname, './public');
    app.use(express.json());
    app.use('/', express.static(baseDirectory));
    app.set('trust proxy', true);
    await PopulatePostLists();

    app.all('*', async (req, res, next) => {
        const path = req.path;
        if(path && !path.startsWith('/stream/status') && !path.startsWith('/hits')){
            // increment hit counter;
            IncrementHitCountForPath(path, req.ip, AppConfig);
        }
        next();
    });

    app.get([`/hits`], async (req, res) => {
        if(req.query && req.query.page){
            res.status(200).send(JSON.stringify({
                count: await GetHitCountForPath(req.query.page, AppConfig)
            }));
        }else{
            res.status(201).send(JSON.stringify({
                count: 0
            }));
        }
    });

    app.get(['/rss/rss.xml'], async (req, res) => {
        res.setHeader("Content-Type", "text/xml")
            .status(200)
            .send(await GenerateRSS([...Blogs(), ...Projects()], TemplateMap));
    });

    app.get([`/blogs/:blogTitle`], async (req, res) => {
        try{
            const blog = Blogs().find(item => item.title.toLowerCase() === req.params.blogTitle.toLowerCase());
            const html = await GenerateFullBlogPost(blog, TemplateMap);
            res.status(200).send(html);
        }catch(e){
            console.error(e);
            res.status(404).send("No such blog post exists.");
        }
    })

    app.get([`/blogs`], async (req, res) => {
        try{
            const filteredBlogs = 
            (req.query && req.query.tags) ?
            FilterPostMetadata(Blogs(), req.query.tags)
            : Blogs();
            const html = await GenerateBlogArchive(filteredBlogs, TemplateMap);
            res.status(200).send(html);
        }catch(e){
            console.error(e);
            res.status(404).send("No such blog post exists.");
        }
    })

    app.get([`/projects/:projectTitle`], async (req, res) => {
        try{
            const project = Projects().find(item => item.title.toLowerCase() === req.params.projectTitle.toLowerCase());
            const html = await GenerateFullBlogPost(project, TemplateMap);
            res.status(200).send(html);
        }catch(e){
            console.error(e);
            res.status(404).send("No such project exists.");
        }
    })

    app.get([`/projects`], async (req, res) => {
        try{
            const filteredProjects =
                (req.query && req.query.tags) ?
                FilterPostMetadata(Projects(), req.query.tags)
                : Projects();
            const html = await GenerateBlogArchive(filteredProjects, TemplateMap);
            res.status(200).send(html);
        }catch(e){
            console.error(e);
            res.status(404).send("No such project post exists.");
        }
    })

    // Home
    app.get(['', '/', '/about'], async (req, res) => {
        const html = await GenerateHomePage(Blogs(), Projects(), TemplateMap)
        res.status(200).send(html);
    });

    // Tells the browser to redirect to the given URL
    // Configurable to redirect to a different channel if I'm on a collab
    app.get('/stream', (req, res) => {
        res.redirect(AppConfig.STREAM_URL);
    });

    app.get('/stream/status', async (req, res) => {
        res.status(200).send(LAST_STREAM_STATUS);
    });

    // Tells the browser to redirect to the given URL
    app.get(['/archive', '/vod'], (req, res) => {
        res.redirect('https://www.youtube.com/@fomtarro/videos');
    });

    // vts-heartrate authentication
    app.get(['/vts-heartrate/oauth2/pulsoid',], async (req, res) => {
        console.log(JSON.stringify(req.query));
        if(req.query && req.query.code){
            try{
                const token = await GetToken(req.query.code, AppConfig);
                const templatePath = path.join('src', 'templates', 'auth.token.html');
                res.status(200).send(await EmbedToken(templatePath, token.body['access_token'], AppConfig));
            }catch(e){
                res.status(500).send(`"An error occured! Please yell at Tom on Twitter.`)
            }
        }else{
            res.status(400).send('BAD REQUEST!');
        }
    });

    // vts-heartrate
    app.get(['/vts-heartrate/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.VTS_HEARTRATE_VERSION,
            date: AppConfig.VTS_HEARTRATE_DATE,
            url: AppConfig.VTS_HEARTRATE_URL
        }));
    });

    app.get(['/vts-heartrate/widget',], async (req, res) => {
        const file = path.join(baseDirectory, './assets', 'hrm.html')
        res.sendFile(file)
    });

    //vts-midi
    app.get(['/vts-midi/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.VTS_MIDI_VERSION,
            date: AppConfig.VTS_MIDI_DATE,
            url: AppConfig.VTS_MIDI_URL
        }));
    });

    // amiyamiga
    app.get(['/amiyamiga/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.AMIYAMIGA_VERSION,
            date: AppConfig.AMIYAMIGA_DATE,
            url: AppConfig.AMIYAMIGA_URL
        }));
    });

    //mintfantome
    app.get(['/mintfantome-desktop/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.MINT_DESKTOP_VERSION,
            date: AppConfig.MINT_DESKTOP_DATE,
            url: AppConfig.MINT_DESKTOP_URL
        }));
    });

    app.get(['/kkcyber-desktop/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.KK_DESKTOP_VERSION,
            date: AppConfig.KK_DESKTOP_DATE,
            url: AppConfig.KK_DESKTOP_URL
        }));
    });

    app.get(['/word-salad/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.WORD_SALAD_VERSION,
            date: AppConfig.WORD_SALAD_DATE,
            url: AppConfig.WORD_SALAD_URL
        }));
    });

    app.get(['/vts-counter/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.VTS_COUNTER_VERSION,
            date: AppConfig.VTS_COUNTER_DATE,
            url: AppConfig.VTS_COUNTER_URL
        }));
    });

    app.get(['/wolfram/ask',], async (req, res) => {
        if(req.query && req.query.input){
            const answer = await WolframAsk(req.query.input, AppConfig);
            res.status(answer.statusCode).send({
                answer: answer.body
            })
        }
    });

    app.post(['/wolfram/ask-post',], async (req, res) => {
        console.log(req.body);
        if(req.body && req.body.input){
            const answer = await WolframAsk(req.body.input, AppConfig);
            res.status(answer.statusCode).send({
                answer: answer.body
            })
        }
    });

    // Currency conversion for the Universal Tracker
    app.get(['/donation/convert',], async (req, res) => {
        if(req.query && req.query.currency){
            const answer = await GetCurrencyRates(req.query.currency)
            res.status(200).send(answer)
        }
    });

    // Gift projects, though this is what itch.io is for, I think?
    app.use('/gifts', express.static(path.join(__dirname, './gifts')));
    app.get(['/gifts/lua-birthday-2021'], (req, res) => {
        const file = path.join(__dirname, './gifts', 'lua-birthday-2021', 'index.html')
        res.sendFile(file);
    });

    // pkmn
    app.use('/pkmn/ribbon-tracker', express.static(path.join(__dirname, './pkmn', 'pkmn-stream-tools', 'ribbon-tracker')));
    app.get(['/pkmn/ribbon-tracker'], (req, res) => {
        const file = path.join(__dirname, './pkmn', 'pkmn-stream-tools', 'ribbon-tracker', 'index.template.html')
        res.status(200).sendFile(file);
    });

    app.use('/pkmn/dmg', express.static(path.join(__dirname, './pkmn', 'pkmn-damage-calc')));
    app.get(['/pkmn/dmg'], (req, res) => {
        const file = path.join(__dirname, './pkmn', 'pkmn-damage-calc', 'iframe.html')
        res.status(200).sendFile(file);
    });

    app.use('/pkmn/tournament-overlay', express.static(path.join(__dirname, './pkmn', 'pkmn-tournament-overlay-tool')));
    app.get(['/pkmn/tournament-overlay'], (req, res) => {
        const file = path.join(__dirname, './pkmn', 'pkmn-tournament-overlay-tool', 'index.html')
        res.status(200).sendFile(file);
    });

    app.get([`/recorder`], async (req, res) => {
        try {
            const html = path.join(baseDirectory, 'audio.html')
            res.status(200).sendFile(html);
        }catch(e){
            console.error(e);
            res.status(404).send("No such project post exists.");
        }
    })

    app.all('*', async (req, res, next) => {
        const filePath = path.join(baseDirectory, req.path);
        // Check if the existing item is a directory or a file.
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            const filesInDir = fs.readdirSync(filePath);
            // If the item is a directory: show all the items inside that directory.
            return res.send(await GenerateFileList(filesInDir, req.path, TemplateMap));
        } else {
            const html = await GenerateNotFound(TemplateMap)
            res.status(404).send(html);
        }
    });

    // Makes an http server out of the express server
    const httpServer = http.createServer(app);
    return httpServer;
}

const YOUTUBE_CLIENT = new YouTubeClient(AppConfig);
const YOUTUBE_TRACKER = new YouTubeTracker(YOUTUBE_CLIENT);

async function createYouTubeTrackerSocket(httpServer, route, channelHandle) {
    const websocketServer = new WebSocket.Server({server: httpServer, path: route});
    websocketServer.on('connection', async (ws) => {
        console.log(`New connection for ${channelHandle} YouTube Tracker!`);
        const currentStreams = await YOUTUBE_TRACKER.getCurrentlyLiveForChannel(channelHandle);
        ws.send(JSON.stringify({
            details: currentStreams
        }));
    });
    YOUTUBE_TRACKER.trackChannel(channelHandle, (detail) => {
        websocketServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    details: [detail]
                }));
            }
        });
    });
    return websocketServer;
}

/**
 * 
 * @param {http.Server} httpServer 
 */
async function createWebSocketRoutes(httpServer){
    const routes = [
        await createYouTubeTrackerSocket(httpServer, '/mintfantome-desktop/youtube/status', '@mintfantome'),
        await createYouTubeTrackerSocket(httpServer, '/amiyamiga/youtube/status', '@amiyaaranha')
    ];

    app.get([`/wss/stats`], async (req, res) => { 
        res.status(200).send(routes.map(ws => {
            return {
                path: ws.address,
                connections: ws.clients,
            }
        }));
    })
}

async function launch(){
    const httpServer = await createHttpRoutes();
    const wssRoutes = await createWebSocketRoutes(httpServer);
    const port = AppConfig.PORT;
    httpServer.listen(port, () => {
        // code to execute when the server successfully starts
        console.log(`started on ${port}`)
    });

    YOUTUBE_TRACKER.start();
}

launch();