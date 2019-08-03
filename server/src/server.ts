import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

// custom modules and classes
let secrets = require('../../secrets.json');
let router = require('./routes');

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