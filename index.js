const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

async function launch(){
    const port = 8080;
    const baseDirectory = path.join(__dirname, './public');

    // Tells express to treat the base directory as relative to the given directory
    // IE localhost:8080/img/blush.png corresponds to public/img/blush.png
    app.use('/', express.static(baseDirectory));

    app.get('/about', (req, res) => {
        res.sendFile((path.join(baseDirectory, 'about.html')))
    });

    // Tells the browser to redirect to the given URL
    app.get('/stream', (req, res) => {
        res.redirect('https://twitch.tv/fomtarro');
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