import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as request from 'request';
import * as moment from 'moment';
import * as secrets from '../../secrets.json'; // "can't find module" can be ignored

let routes = require('./routes');

// <editor-fold desc="Variables">
const port = secrets.localserver.port;
const fileName = 'dcslog.json';

const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use('/', routes);
// </editor-fold desc="Variables">

// <editor-fold desc="Program">

// checkForLog();

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    return console.log('Server listening on port ' + port);
});
// </editor-fold desc="Program">


// <editor-fold desc="FUNctions">
// checks to see if the local log file exists, if not, ask if we want to create and populate it
function checkForLog() {
    fs.exists(fileName, (exists => {
        if (!exists) {
            console.log("Local log file not found, do you want to download the full log from the server? y/n " +
                "(This will take a while)");
            process.stdin.addListener("data", function (data) {
                const response = data.toString().trim().toLowerCase();

                if (response === 'y') {
                    writeToFile(done => {

                    })
                } else {
                    console.log('ok :(');
                }
            })
        } else {
            console.log('Log file found!');
        }
    }));
}

// parse the local file into the data requested
function parseLog() {
    let logFile = fs.readFileSync(fileName);
    let jsonLog = JSON.parse(logFile); // buffer to string warning can be ignored

    console.log(jsonLog.results[0].series[0].values[0]);

}

// writes the downloaded log to the local file
function writeToFile(callback) {
    console.log('Downloading log, hold on...');
    getLog(log => {
        console.log('Log downloaded, writing to file');
        fs.appendFileSync(fileName, log);
        console.log('Done!');
    });
}

// retrieves the log from the server // TODO: go through 1 day at a time to download the log
function getLog(callback) {
    const monitoring = secrets.monitoring;

    const properties = {
        'u': monitoring.user,
        'p': monitoring.password,
        'q': 'SELECT "message" FROM "telegraf"."autogen"."syslog" WHERE time > now() - 1d' // anything longer than 1 day will likely crash influx
    };

    request({
        url: monitoring.url,
        qs: properties
    }, function (err, res, body) {
        if (err) {console.log(err); return;}
        callback(body);
    })
}

// supply initial date, returns initial date, plus one day previous
function buildDates(year: number, month: number, day: number) {
    let dates = [];

    let initialDate = moment(year + '-' + month + '-' + day, 'YYYY-MM-DD');

    dates.push(initialDate.format('YYYY-MM-DD'));
    dates.push(initialDate.subtract(1, 'day').format('YYYY-MM-DD'));

    return dates;
}
// </editor-fold desc="FUNctions">