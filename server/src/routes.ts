import * as express from 'express';
import * as fs from 'fs';

let router = express.Router();

let fileName = 'dcslog.json';


router.get('/test', function (req, res, next) {
    res.send('test!');
});

router.get('/pilots', function (req, res, next) {
    getPilots(results => {
        res.send(results);
    })
});


module.exports = router;


function getPilots(callback) {
    let pilots: Pilot[] = [];
    const regexp = new RegExp('player: (.+) side:. slot:.+ ucid: ([a-z0-9]{32})'); // create regex

    let logFile = JSON.parse(fs.readFileSync(fileName)).results[0].series[0].values; // ignore buffer warning

    logFile.forEach(line => {
        if (line[1].indexOf('ALLOW') > 0) { // check if line is a pilot entering a plane
            try {
                const regMatch = line[1].match(regexp); // get the regex match, which includes the groups

                if (regMatch !== null) { // make sure regmatch is not null, pretty sure this happens when the pilots name is blank
                    const newPilot = new Pilot(regMatch[1], regMatch[2]); // create temp pilot object

                    const testForExistingPilot = pilots.find(pilot => { // search through existing pilots
                        return pilot.ucid === newPilot.ucid
                    });

                    if (testForExistingPilot) { // if this is not null, the pilot already exists
                        if (testForExistingPilot.name !== newPilot.name) { // if the two names don't match, we add an alias
                            // testForExistingPilot now equals an existing pilot in the array

                            if (testForExistingPilot.aliases.length > 0) { // if this pilot doesn't have any aliases, no need to check for a match
                                if (testForExistingPilot.aliases.find(alias => alias !== newPilot.name)) {
                                    testForExistingPilot.addAlias(newPilot.name);
                                }
                            } else {
                                testForExistingPilot.addAlias(newPilot.name);
                            }
                        } // otherwise do nothing
                    } else { // else pilot does not exist, so we should add it
                        pilots.push(newPilot);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    });

    callback(pilots);
}

class Pilot {
    name: string;
    ucid: string;
    aliases: string[] = [];

    constructor(_name, _ucid) {
        this.name = _name;
        this.ucid = _ucid;
    }

    addAlias(_name) {
        this.aliases.push(_name);
    }
}