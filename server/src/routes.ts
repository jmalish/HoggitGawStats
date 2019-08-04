import * as express from 'express';
import * as fs from 'fs';

let Pilot = require('./classes/Pilot');
let TeamKill = require('./classes/TeamKill');

let router = express.Router();

let pilots: Pilot[] = [];
let teamKills: TeamKill[] = [];
let playersData = [];
let totalsData = [];

// <editor-fold desc='Startup'>
readNamesFile(_ => {});
readTeamKillsFile(_ => {});
readPlayerDataFile(_ => {});
// </editor-fold desc='Startup'>

// <editor-fold desc='Routes'>
router.get('/test', function (req, res, next) {
    res.send('test!');
});

router.get('/pilots', function (req, res, next) {
    let returnedPilots: Pilot[] = pilots;

    if (req.query['search'] != undefined) {
        returnedPilots = pilots.filter(pilot => pilot.name.toLowerCase().indexOf(req.query['search'].toLowerCase()) > -1);
    } else if (req.query['ucid'] != undefined) {
        returnedPilots = pilots.filter(pilot => pilot.ucid === req.query['ucid']);
    }

    res.json(returnedPilots);
});

router.get('/pilot/:ucid', function (req, res, next) {
    let pilotUcid = req.params.ucid;

    let findPilot = pilots.find(function (pilot) {
        return pilot.ucid === pilotUcid;
    });

    res.json(findPilot);
});

router.get('/playerData/totals', function (req, res, next) {
    res.json(totalsData[0]);
});

router.get('/playerData/:ucid', function (req, res, next) {
    let pilotUcid = req.params.ucid;

    let findPilot = playersData.find(function (playerData) {
        return playerData.player['uID'] === pilotUcid;
    });

    res.json(findPilot);
});
// </editor-fold desc='Routes'>

// <editor-fold desc='Functions'>
function readNamesFile(callback) {
    pilots = []; // empty pilots array

    fs.readFile('data/name_data.csv', 'utf8', function(err, data) { // read file
        let rows = data.split('\r\n'); // split file into rows

        rows.forEach(row => { // for each row
            let newPilot = new Pilot(); // create new Pilot object
            if (row[0] != undefined) { // make sure we don't grab an empty line
                let columns = row.split(','); // split row into columns

                if (columns[0] === 'uID') return; // skip headers line

                newPilot.name = ''; // set pilot name to a blank string for the sake of the object, set later
                newPilot.ucid = columns[0]; // set pilot ucid
                newPilot.slID = columns[1]; // set pilot slID

                for (let i = columns.length - 1; i > 1; i--) { // for each column
                    if (columns[i] !=  '0' && columns[i] != '0\r') { // ignore columns that are just a 0
                        if (newPilot.name === '') { // if pilot name hasn't been set
                            newPilot.name = columns[i]; // set it
                        } else {
                            if (columns[i] != newPilot.name) { // make sure this name doesn't match the current name
                                let checkAliases = newPilot.aliases.find(alias => { // make sure this name isn't already in the array
                                    return alias === columns[i];
                                });

                                if (!checkAliases) newPilot.aliases.push(columns[i]); // add it if not
                            }
                        }
                    }
                }
            }

            if (newPilot.ucid != undefined) { // if ucid is undefined, it's probably a blank line, so ignore it
                pilots.push(newPilot); // add new pilot to array
            }
        });
        callback(true);
    });
}

function readTeamKillsFile(callback) {
    teamKills = []; // clear teamKills array

    fs.readFile('data/teamkills.csv', 'utf8', function(err, data) { // read file
        let rows = data.split('\r\n'); // split file into arrays

        rows.forEach(row => { // for each row
            if (row[0] != undefined) { // make sure we don't grab an empty line
                let columns = row.split(','); // split row into columns

                if (columns[0] === 'uID') return; // skip headers line

                teamKills.push(new TeamKill(columns[0], columns[1], columns[2], columns[3], columns[4], columns[5], columns[6], columns[7], columns[8]));
            }
        });
        callback(true);
    });
}

function readPlayerDataFile(callback) {
    playersData = []; // empty array

    fs.readFile('data/player_data.csv', 'utf8', function(err, data) { // read file
        let rows = data.split('\r\n'); // split file into rows

        let headers = rows[0].split(','); // get headers from the first row

        // local arrays for totals
        let weaponsTotals = {};
        let killsTotals = {};
        let aircraftTotals = {};
        let lossesTotals = {};

        rows.forEach(row => { // for each row
            if (row != rows[0]) { // skip header row
                // local arrays
                let player = {};
                let weapons = {};
                let kills = {};
                let aircraft = {};
                let losses = {};

                let columns = row.split(','); // split row into columns

                for (let i = 0; i < columns.length - 1; i++) { // for each column
                    if (columns[i] != '0' && columns[i] != undefined) { // skip the cell if 0 to save space, undefined means a blank line, so ignore those too
                        if (headers[i].match(/\bweapon/)) { // isWeapon
                            weapons[headers[i]] = columns[i]; // add column to weapons array

                            if (weaponsTotals[headers[i]] === undefined) { // if weaponsTotals is empty, we need to tell it it's a number
                                weaponsTotals[headers[i]] = 0; // set it to 0
                            }
                            weaponsTotals[headers[i]] += parseInt(columns[i]); // add this value to the correlating array location
                        } else if (headers[i].match(/kills/)) { // isKill
                            kills[headers[i]] = columns[i];

                            if (killsTotals[headers[i]] === undefined) {
                                killsTotals[headers[i]] = 0;
                            }
                            killsTotals[headers[i]] += parseInt(columns[i]);
                        } else if (headers[i].match(/Time/)) { // isAircraft
                            aircraft[headers[i]] = columns[i];

                            if (aircraftTotals[headers[i]] === undefined) {
                                aircraftTotals[headers[i]] = 0.00;
                            }
                            aircraftTotals[headers[i]] += parseFloat(columns[i]);
                        } else if (headers[i].match(/loss/)) { // isLoss
                            losses[headers[i]] = columns[i];

                            if (lossesTotals[headers[i]] === undefined) {
                                lossesTotals[headers[i]] = 0;
                            }
                            lossesTotals[headers[i]] += parseInt(columns[i]);
                        } else { // otherwise it's player data (uID, and slID)
                            player[headers[i]] = columns[i];
                        }
                    }
                }

                const newPlayerData = { // add arrays to object
                    player,
                    weapons,
                    kills,
                    aircraft,
                    losses
                };

                playersData.push(newPlayerData); // add this playerData to array
            }
        });

        let totalPlayers = playersData.length;
        const newTotalsData = { // add arrays to totals
            totalPlayers,
            weaponsTotals,
            killsTotals,
            aircraftTotals,
            lossesTotals
        };

        totalsData.push(newTotalsData); // add totals object to totalsData array

        callback(true);
    });
}
// </editor-fold desc='Functions'>

module.exports = router; // export router