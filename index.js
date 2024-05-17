const http = require('http');
const path = require('path');
const express = require('express');
const { AppConfig } = require('./app.config');
const { GetToken } = require('./src/usecases/get.token.usecase');
const { EmbedToken } = require('./src/usecases/embed.token.usecase');
const { WolframAsk } = require('./src/usecases/wolfram.ask.usecase');

// Apply the rate limiting middleware to API calls only
const app = express();

async function launch(){
    const port = AppConfig.PORT;
    const baseDirectory = path.join(__dirname, './public');
    app.use(express.json());
    // app.use('/', express.static(baseDirectory));
    /*
    // Tells express to treat the base directory as relative to the given directory
    // IE localhost:8080/img/blush.png corresponds to public/img/blush.png
    app.use('/', express.static(baseDirectory));

    app.get('/about', (req, res) => {
        res.sendFile((path.join(baseDirectory, 'about.html')))
    });
    */
    // Tells the browser to redirect to the given URL
    app.get(['', '/', '/about'], (req, res) => {
        res.redirect('https://skeletom.carrd.co/');
    });
    // Tells the browser to redirect to the given URL
    app.get('/stream', (req, res) => {
        res.redirect('https://twitch.tv/skeletom_ch');
    });
    // Tells the browser to redirect to the given URL
    app.get(['/archive', '/vod'], (req, res) => {
        res.redirect('https://www.youtube.com/channel/UCr5N4CrcoegFpm7fR5a_ORg/videos');
    });

    // vts-heartrate authentication
    app.get(['/vts-heartrate/oauth2/pulsoid',], async (req, res) => {
        console.log(JSON.stringify(req.query));
        if(req.query && req.query.code){
            try{
                const token = await GetToken(req.query.code, AppConfig);
                const templatePath = path.join('src', 'templates', 'pulsoid.token.html');
                res.status(200).send(await EmbedToken(templatePath, token.body['access_token'], AppConfig));
            }catch(e){
                res.status(500).send(`"An error occured! Please yell at Tom on Twitter.`)
            }
        }else{
            res.status(400).send('BAD REQUEST!');
        }
    });

    app.get(['/vts-heartrate/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.VTS_HEARTRATE_VERSION,
            date: AppConfig.VTS_HEARTRATE_DATE,
            url: AppConfig.VTS_HEARTRATE_URL
        }));
    });

    app.get(['/amiyamiga/version',], async (req, res) => {
        res.status(200).send(JSON.stringify({
            version: AppConfig.AMIYAMIGA_VERSION,
            date: AppConfig.AMIYAMIGA_DATE,
            url: AppConfig.AMIYAMIGA_URL
        }));
    });

    // wolfram
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

    // Gift projects, though this is what itch.io is for, I think?
    app.use('/gifts', express.static(path.join(__dirname, './gifts')));
    app.get(['/gifts/lua-birthday-2021'], (req, res) => {
        const file = path.join(__dirname, './gifts', 'lua-birthday-2021', 'index.html')
        console.log(file);
        res.sendFile(file);
    });

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

    // Makes an http server out of the express server
    const httpServer = http.createServer(app);

    // Starts the http server
    httpServer.listen(port, () => {
        // code to execute when the server successfully starts
        console.log(`started on ${port}`);
    });
}

launch();