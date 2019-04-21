import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as request from 'request';
import * as moment from 'moment';
import * as mergeJSON from 'merge-json';

// custom modules and classes
let secrets = require('../../secrets.json');
let LogChunk = require('./classes/DateChunk.js');
let routes = require('./routes');

// <editor-fold desc="Variables">
const port = secrets.localserver.port;
const fileName = 'dcslog.json';

const app = express() // setup express with necessary settings
    .use(cors())
    .use(bodyParser.json())
    .use('/', routes);
// </editor-fold desc="Variables">

// <editor-fold desc="Program">
checkForLog(); // look to see if the log exists

app.listen(port, (err) => { // create server
    if (err) {
        return console.log(err);
    }

    return console.log('Server listening on port ' + port);
});
// </editor-fold desc="Program">


// <editor-fold desc="FUNctions">
// checks to see if the local log file exists, if not, ask if we want to create and populate it
function checkForLog() {
    fs.exists(fileName, (exists => { // check if file exists
        if (!exists) {
            console.log("Local log file not found, do you want to download the full log from the server? y/n " +
                "(This will take a while)");
            process.stdin.addListener("data", function (data) { // ask user if they want to download log
                const response = data.toString().trim().toLowerCase(); // save answer

                if (response === 'y') {
                    buildLog(log => {
                        fs.appendFile(fileName, log, _ => {});
                    })
                } else {
                    console.log('ok :(');
                }
            })
        } else { // if the file is found, update log so it's up to date
            console.log('Log file found!');
            // console.log('Updating log, this could take a sec...');
            // updateLog(done => { //TODO: rewrite updateLog()
            //     console.log('Done');
            // })
        }
    }));
}

// writes the downloaded log to the local file
function buildLog(callback) {
    let dateFormatString = 'YYYY-MM-DDTHH:mm:ss.SSS';
    let logInMem = [];  // place to temporarily hold log so we're not reading and writing a ton

    console.log('Downloading log, hold on...');
    buildDates(chunks => { // get date chunks
        for (let i = 0; i <= chunks.length - 1; i++) {
            setTimeout(function (i) {
                getLog(log => {
                    logInMem = mergeJSON(logInMem, log); // append new log chunk to log in memory
                }, moment.utc(chunks[i].startTime).format(dateFormatString), moment.utc(chunks[i].stopTime).format(dateFormatString));
            }, 5000 * i, i); // if needed, increase timeout (5000)
        }
    });
    callback(logInMem); // return the log json object
    console.log('done');
}

// builds an array of date chunks
function buildDates(callback) {
    let dateChunks: DateChunk[] = []; // stores dateChunks so we can return them as an array

    let initialTime = moment('2018-11-27T00:00:00.000'); // as best I can tell, the first line in the log starts after this date/time
    let chunkLength = 12; // how long we want chunks to be, in hours, default 12

    // find how many chunks we need, finds the time difference between initial datetime and current datetime in hours, divides by 12 to get number of 12 hours blocks
    // this will actually give a few hours before the start time and after the current time, but that shouldn't be a problem
    let chunksNeeded = Math.ceil(initialTime.diff(moment().format(), 'hours') / -(chunkLength));

    let nextTime = initialTime.clone(); // .add() below mutates the object it's attached to, so we clone this one so we can use it later

    for (let i = 0; i < chunksNeeded; i++) { // go through and create the needed chunks
        let startTime = nextTime.clone();
        let stopTime = nextTime.clone();

        startTime.add(1, 'milliseconds'); // add 1 millisecond so we don't run the risk of getting the same line twice
        stopTime.add(chunkLength, 'hours'); // add number of hours to get end time


        dateChunks.push(new LogChunk(startTime, stopTime)); // add to our array

        nextTime.add(chunkLength, 'hours'); // set nextTime to be ready for next iteration
    }

    callback(dateChunks); // return chunks
}

// retrieves the log from the server
function getLog(callback, startTime: string = null, stopTime: string = null) {
    let qString = 'SELECT "message" FROM "telegraf"."autogen"."syslog" WHERE time > now() - 5m'; // set default query

    if (startTime && stopTime) { // if both startTime and stopTime are set, build a query using them
        qString = 'SELECT "message" FROM "telegraf"."autogen"."syslog" ' +
            'WHERE time >= \'' + startTime + // start time
            '\' AND time < \'' + stopTime + '\';';  // end time
    }

    const properties = { // set properties for server request using secrets file
        'u': secrets.monitoring.user,
        'p': secrets.monitoring.password,
        'q': qString
    };

    request({ // send a request to the server using the given settings
        url: secrets.monitoring.url,
        qs: properties
    }, function (err, res, body) {
        if (err) {console.log(err); return;}

        let log = JSON.parse(body); // save the log to a local variable in json format
        log = log.results[0].series[0].values; // cut down to the part of the json we want

        callback(JSON.stringify(log)); // return the log
    });
}
// </editor-fold desc="FUNctions">