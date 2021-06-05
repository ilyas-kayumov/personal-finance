const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const http = require('http');
const https = require('https');
const fs = require('fs');

const hostname = 'www.multicurrencyfinance.com';

const app = express();

const cert = fs.readFileSync('../ssl/www_multicurrencyfinance_com.crt');
const ca = fs.readFileSync('../ssl/www_multicurrencyfinance_com.crt');
const key = fs.readFileSync('../ssl/www_multicurrencyfinance_com.key');

const options = { cert, ca, key };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.all('*', ensureSecure);

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', proxy('https://localhost:5001', {
    proxyReqPathResolver: function (req) {
        return '/api' + req.url;
    },
    proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
        proxyReqOpts.rejectUnauthorized = false
        return proxyReqOpts;
    }
}));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

httpServer.listen(80, hostname);
httpsServer.listen(443, hostname);

function ensureSecure(req, res, next) {
    if (req.secure) {
        // OK, continue
        return next();
    };
    // handle port numbers if you need non defaults
    // res.redirect('https://' + req.host + req.url); // express 3.x
    res.redirect('https://' + req.hostname + req.url); // express 4.x
}