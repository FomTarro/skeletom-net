const http = require('http');
const path = require('path');
const fs = require("fs");
const express = require('express');
const WebSocket = require('ws');
const { AppConfig } = require('./app.config');
const { GetToken } = require('./src/usecases/get.token.usecase');
const { EmbedToken } = require('./src/usecases/embed.token.usecase');
const { GetCurrencyRates } = require('./src/usecases/currency.convert.usecase');
const { Blogs, Projects, FilterPostMetadata, PopulatePostLists } = require('./src/usecases/convert.markdown.usecase');
const { GenerateHomePage, GenerateFullBlogPost, GenerateBlogArchive, GenerateNotFound, GenerateFileList } = require('./src/usecases/embed.html.usecase');
const { TemplateMap } = require('./src/pages/template.map');
const { PageGenerator } = require('./src/pages/page.generator');
const { YouTubeClient } = require('./src/adapters/streams/youtube.client');
const { YouTubeTracker } = require('./src/adapters/streams/trackers/youtube.tracker');
const { TwitchClient } = require('./src/adapters/streams/twitch.client');
const { TwitchTracker } = require('./src/adapters/streams/trackers/twitch.tracker');
const { AWSClient } = require('./src/adapters/aws.client');
const { HitCounter } = require('./src/utils/hit.counter');
const { WolframClient } = require('./src/adapters/wolfram.client');

const APP_CONFIG = new AppConfig();
const TEMPLATE_MAP = new TemplateMap();

const PAGE_GENERATOR = new PageGenerator(APP_CONFIG, TEMPLATE_MAP);

const YOUTUBE_CLIENT = new YouTubeClient(APP_CONFIG);
const YOUTUBE_TRACKER = new YouTubeTracker(YOUTUBE_CLIENT);

const TWITCH_CLIENT = new TwitchClient(APP_CONFIG);
const TWITCH_TRACKER = new TwitchTracker(TWITCH_CLIENT);

const AWS_CLIENT = new AWSClient(APP_CONFIG);
const HIT_COUNTER = new HitCounter(AWS_CLIENT);

const WOLFRAM_CLIENT = new WolframClient(APP_CONFIG);

/**
 * Creates an HTTP server.
 * @returns {Promise<http.Server>}
 */
async function createHttpRoutes() {
    const app = express();
    const baseDirectory = path.join(__dirname, './public');
    app.use(express.json());
    app.use('/', express.static(baseDirectory));
    app.set('trust proxy', true);
    await PopulatePostLists(APP_CONFIG);

    app.all('*', async (req, res, next) => {
        const path = req.path;
        if (path && !path.startsWith('/hits')) {
            // increment hit counter;
            HIT_COUNTER.incrementHitCountForPath(path, req.ip);
        }
        next();
    });

    app.get([`/hits`], async (req, res) => {
        if (req.query && req.query.page) {
            res.status(200).send(JSON.stringify({
                count: await HIT_COUNTER.getHitCountForPath(req.query.page)
            }));
        } else {
            res.status(201).send(JSON.stringify({
                count: 0
            }));
        }
    });

    app.get(['/rss/rss.xml'], async (req, res) => {
        res.setHeader("Content-Type", "text/xml")
            .status(200)
            .send(await PAGE_GENERATOR.generateRSS([...Blogs(), ...Projects()]));
    });

    app.get(['/rss/blogs.xml'], async (req, res) => {
        res.setHeader("Content-Type", "text/xml")
            .status(200)
            .send(await PAGE_GENERATOR.generateRSS([...Blogs()]));
    });

    app.get(['/rss/projects.xml'], async (req, res) => {
        res.setHeader("Content-Type", "text/xml")
            .status(200)
            .send(await PAGE_GENERATOR.generateRSS([...Projects()]));
    });

    app.get([`/blogs/:blogTitle`], async (req, res) => {
        try {
            const blog = Blogs().find(item => item.title.toLowerCase() === req.params.blogTitle.toLowerCase());
            const html = await GenerateFullBlogPost(blog, TEMPLATE_MAP);
            res.status(200).send(html);
        } catch (e) {
            console.error(e);
            res.status(404).send("No such blog post exists.");
        }
    })

    app.get([`/blogs`], async (req, res) => {
        try {
            const filteredBlogs =
                (req.query && req.query.tags) ?
                    FilterPostMetadata(Blogs(), req.query.tags)
                    : Blogs();
            const html = await GenerateBlogArchive(filteredBlogs, TEMPLATE_MAP);
            res.status(200).send(html);
        } catch (e) {
            console.error(e);
            res.status(404).send("No such blog post exists.");
        }
    })

    app.get([`/projects/:projectTitle`], async (req, res) => {
        try {
            const project = Projects().find(item => item.title.toLowerCase() === req.params.projectTitle.toLowerCase());
            const html = await GenerateFullBlogPost(project, TEMPLATE_MAP);
            res.status(200).send(html);
        } catch (e) {
            console.error(e);
            res.status(404).send("No such project exists.");
        }
    })

    app.get([`/projects`], async (req, res) => {
        try {
            const filteredProjects =
                (req.query && req.query.tags) ?
                    FilterPostMetadata(Projects(), req.query.tags)
                    : Projects();
            const html = await GenerateBlogArchive(filteredProjects, TEMPLATE_MAP);
            res.status(200).send(html);
        } catch (e) {
            console.error(e);
            res.status(404).send("No such project exists.");
        }
    })

    // Home
    app.get(['', '/', '/about'], async (req, res) => {
        const html = await GenerateHomePage(Blogs(), Projects(), TEMPLATE_MAP)
        res.status(200).send(html);
    });

    // Tells the browser to redirect to the given URL
    // Configurable to redirect to a different channel if I'm on a collab
    app.get('/stream', (req, res) => {
        res.redirect(APP_CONFIG.STREAM_URL);
    });

    app.get(['/archive', '/vod'], (req, res) => {
        res.redirect('https://www.youtube.com/@fomtarro/videos');
    });

    // vts-heartrate authentication
    app.get(['/vts-heartrate/oauth2/pulsoid',], async (req, res) => {
        console.log(JSON.stringify(req.query));
        if (req.query && req.query.code) {
            try {
                const token = await GetToken(req.query.code, APP_CONFIG);
                const templatePath = path.join('src', 'templates', 'auth.token.html');
                res.status(200).send(await EmbedToken(templatePath, token.body['access_token'], APP_CONFIG));
            } catch (e) {
                res.status(500).send(`"An error occured! Please yell at Tom via email: tom@skeletom.net.`)
            }
        } else {
            res.status(400).send('BAD REQUEST!');
        }
    });

    // vts-heartrate
    app.get(['/vts-heartrate/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.VTS_HEARTRATE_VERSION,
            date: APP_CONFIG.VTS_HEARTRATE_DATE,
            url: APP_CONFIG.VTS_HEARTRATE_URL
        }));
    });

    app.get(['/vts-heartrate/widget',], async (req, res) => {
        const file = path.join(baseDirectory, './assets', 'hrm.html')
        res.sendFile(file)
    });

    //vts-midi
    app.get(['/vts-midi/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.VTS_MIDI_VERSION,
            date: APP_CONFIG.VTS_MIDI_DATE,
            url: APP_CONFIG.VTS_MIDI_URL
        }));
    });

    // amiyamiga
    app.get(['/amiyamiga/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.AMIYAMIGA_VERSION,
            date: APP_CONFIG.AMIYAMIGA_DATE,
            url: APP_CONFIG.AMIYAMIGA_URL
        }));
    });

    //mintfantome
    app.get(['/mintfantome-desktop/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.MINT_DESKTOP_VERSION,
            date: APP_CONFIG.MINT_DESKTOP_DATE,
            url: APP_CONFIG.MINT_DESKTOP_URL
        }));
    });

    app.get(['/kkcyber-desktop/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.KK_DESKTOP_VERSION,
            date: APP_CONFIG.KK_DESKTOP_DATE,
            url: APP_CONFIG.KK_DESKTOP_URL
        }));
    });

    app.get(['/word-salad/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.WORD_SALAD_VERSION,
            date: APP_CONFIG.WORD_SALAD_DATE,
            url: APP_CONFIG.WORD_SALAD_URL
        }));
    });

    app.get(['/vts-counter/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: APP_CONFIG.VTS_COUNTER_VERSION,
            date: APP_CONFIG.VTS_COUNTER_DATE,
            url: APP_CONFIG.VTS_COUNTER_URL
        }));
    });

    app.get(['/wolfram/ask',], async (req, res) => {
        if (req.query && req.query.input) {
            const answer = await WOLFRAM_CLIENT.ask(req.query.input);
            res.status(answer.status).send({
                answer: answer.body
            })
        }
    });

    app.post(['/wolfram/ask-post',], async (req, res) => {
        if (req.body && req.body.input) {
            const answer = await WOLFRAM_CLIENT.ask(req.body.input);
            res.status(answer.status).send({
                answer: answer.body
            })
        }
    });

    // Currency conversion for the Universal Tracker
    app.get(['/donation/convert',], async (req, res) => {
        if (req.query && req.query.currency) {
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
        } catch (e) {
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
            return res.send(await GenerateFileList(filesInDir, req.path, TEMPLATE_MAP));
        } else {
            const html = await GenerateNotFound(TEMPLATE_MAP)
            res.status(404).send(html);
        }
    });

    // Makes an http server out of the express server
    const httpServer = http.createServer(app);
    return httpServer;
}

class YouTubeTrackerRoute {
    /**
     * Class for configuring a YouTube Tracker route for a WebSocket server.
     * @param {string} route 
     * @param {WebSocket.Server} server 
     * @param {string} channelHandle 
     */
    constructor(route, server, channelHandle) {
        // TODO: this is a case where TypeScript could come in clutch,
        // making an interface for Route classes that require a Route accessor 
        // and an onConnection(client) callback definition
        this.route = route;
        YOUTUBE_TRACKER.trackChannel(channelHandle, route, (detail) => {
            for (const client of server.clients) {
                if (client.readyState === WebSocket.OPEN
                    && client.route && client.route.toLowerCase() === route.toLowerCase()) {
                    const content = JSON.stringify({
                        details: [detail]
                    });
                    client.send(content);
                }
            }
        });
        this.onConnection = async (webSocketClient) => {
            console.log(`New connection for ${channelHandle} YouTube Tracker!`);
            const currentStreams = await YOUTUBE_TRACKER.getCurrentlyLiveForChannel(channelHandle);
            const content = JSON.stringify({
                details: [...currentStreams]
            });
            webSocketClient.send(content);
        }
    }
}

class TwitchTrackerRoute {
    /**
     * Class for configuring a Twitch Tracker route for a WebSocket server.
     * @param {string} route 
     * @param {WebSocket.Server} server 
     * @param {string} userLogin 
     */
    constructor(route, server, userLogin) {
        this.route = route;
        TWITCH_TRACKER.trackChannel(userLogin, route, (detail) => {
            for (const client of server.clients) {
                if (client.readyState === WebSocket.OPEN
                    && client.route && client.route.toLowerCase() === route.toLowerCase()) {
                    const content = JSON.stringify({
                        details: [detail]
                    });
                    client.send(content);
                }
            }
        });
        this.onConnection = async (webSocketClient) => {
            console.log(`New connection for ${userLogin} Twitch Tracker!`);
            const currentStream = await TWITCH_TRACKER.getCurrentlyLiveForChannel(userLogin);
            const content = JSON.stringify({
                details: [...currentStream]
            });
            webSocketClient.send(content);
        }
    }
}

class StreamTrackerRoute {
    /**
     * Class for configuring a Twitch Tracker of YouTube route for a WebSocket server.
     * @param {string} route 
     * @param {WebSocket.Server} server 
     * @param {string} streamAddress 
     */
    constructor(route, server, streamAddress) {
        this.route = route;
        // if it's a twitch stream, track the channel
        if (streamAddress.includes(`twitch.tv`)) {
            const userLogin = streamAddress.split('/').pop();
            TWITCH_TRACKER.trackChannel(userLogin, route, (detail) => {
                for (const client of server.clients) {
                    if (client.readyState === WebSocket.OPEN
                        && client.route && client.route.toLowerCase() === route.toLowerCase()) {
                        const content = JSON.stringify({
                            details: [detail]
                        });
                        client.send(content);
                    }
                }
            });
            this.onConnection = async (webSocketClient) => {
                console.log(`New connection for ${userLogin} Stream Tracker!`);
                const currentStream = await TWITCH_TRACKER.getCurrentlyLiveForChannel(userLogin);
                const content = JSON.stringify({
                    details: [...currentStream]
                });
                webSocketClient.send(content);
            }
        } else if (streamAddress.includes(`youtube.com`)) {
            // TODO
        }
    }
}

/**
 * Creates a WebSocket server from an existing HTTP Server.
 * @param {http.Server} httpServer 
 * @returns {Promise<WebSocket.Server>}
 */
async function createWebSocketRoutes(httpServer) {
    const webSocketServer = new WebSocket.Server({ server: httpServer });
    const routes = new Map([
        new YouTubeTrackerRoute(`/mintfantome-desktop/youtube/status`, webSocketServer, '@mintfantome'),
        new YouTubeTrackerRoute(`/amiyamiga/youtube/status`, webSocketServer, '@amiyaaranha'),
        new TwitchTrackerRoute(`/twitch/status`, webSocketServer, 'skeletom_ch'),
        new StreamTrackerRoute(`/stream/status`, webSocketServer, APP_CONFIG.STREAM_URL)
    ].map(i => [i.route.toLowerCase(), i]));
    webSocketServer.on('open', async () => {
        console.log(`WebSocket Server now open!`);
    });
    webSocketServer.on('connection', async (ws, req) => {
        const url = req.url.toLowerCase();
        console.log(`Attempting WebSocket connection to ${url}`);
        if (routes.has(url)) {
            // tag the socket as being connected to this route
            // so that we can properly filter it later
            ws.route = url;
            routes.get(url).onConnection(ws);
        } else {
            // close any sockets connecting to unknown routes
            ws.close();
        }
    });
    return webSocketServer;
}

async function launch() {
    const httpServer = await createHttpRoutes();
    const port = APP_CONFIG.PORT;
    httpServer.listen(port, async () => {
        // code to execute when the server successfully starts
        console.log(`Started on ${port}`);
        HIT_COUNTER.start();

        // trackers and sockets
        const wsServer = await createWebSocketRoutes(httpServer);
        YOUTUBE_TRACKER.start();
        TWITCH_TRACKER.start();
    });
}

launch();