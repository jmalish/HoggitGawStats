import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as request from 'request';

// custom modules and classes
let secrets = require('../../secrets.json');
// let Pilot = require('./classes/Pilot.js');
// let TeamKill = require('./classes/TeamKill.js');
let router = require('./routes');

// let pilots: Pilot[] = [];
// let teamKills: TeamKill[] = [];

// <editor-fold desc="Express app setup">
const port = secrets.localserver.port;

const app = express() // setup express with necessary settings
    .use(cors())
    .use(bodyParser.json())
    .use('/', router);
// </editor-fold desc="Express app setup">

// <editor-fold desc="Server">
app.listen(port, (err) => { // create server
    if (err) {
        return console.log(err);
    }

    return console.log('Server listening on port ' + port);
});
// </editor-fold desc="Program">