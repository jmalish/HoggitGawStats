import * as express from 'express';
import * as fs from 'fs';

let Pilot = require('./classes/Pilot.js');
let TeamKill = require('./classes/TeamKill');

let router = express.Router();

let pilots: Pilot[] = [];
let teamKills: TeamKill[] = [];
let playerDatas = [];

readNamesFile(_ => {});
readTeamKillsFile(_ => {});
readPlayerDataFile(_ => {
    // console.log(playerDatas[0]);
});

router.get('/test', function (req, res, next) {
    res.send('test!');
});

router.get('/pilots', function (req, res, next) {
    res.send(pilots);
});

router.get('/pilot/:ucid', function (req, res, next) {
    let pilotUcid = req.params.ucid;

    let findPilot = pilots.find(function (pilot) {
        return pilot.ucid === pilotUcid;
    });

    res.send(findPilot);
});

router.get('/playerData/:ucid', function (req, res, next) {
    let pilotUcid = req.params.ucid;

    let findPilot = playerDatas.find(function (pData) { // TODO: This isn't working correctly, just returns an empty array
        return pData["player"].uID = pilotUcid;
    });

    // console.log(pilotUcid);
    res.send(findPilot);
});


// <editor-fold desc='Functions'>
function readNamesFile(callback) {
    pilots = []; // empty pilots array

    fs.readFile('data/name_data.csv', 'utf8', function(err, data) {
        let rows = data.split('\r\n');

        rows.forEach(row => {
            let newPilot = new Pilot();
            if (row[0] != undefined) { // make sure we don't grab an empty line
                let columns = row.split(',');

                if (columns[0] === 'uID') return; // skip headers line

                newPilot.name = '';
                newPilot.ucid = columns[0];
                newPilot.slID = columns[1];

                for (let i = columns.length - 1; i > 1; i--) {
                    if (columns[i] !=  '0' && columns[i] != '0\r') {
                        if (newPilot.name === '') {
                            newPilot.name = columns[i];
                        } else {
                            if (columns[i] != newPilot.name) { // make sure this name doesn't match the current name
                                let checkAliases = newPilot.aliases.find(alias => { // make sure this name isn't already in the array
                                    return alias === columns[i];
                                });

                                if (!checkAliases) newPilot.aliases.push(columns[i]);
                            }
                        }
                    }
                }
            }
            if (newPilot.ucid != undefined) {
                pilots.push(newPilot);
            }
        });
        callback(true);
    });
}

function readTeamKillsFile(callback) {
    teamKills = []; // clear teamKills array

    fs.readFile('data/teamkills.csv', 'utf8', function(err, data) {
        let rows = data.split('\r\n');

        rows.forEach(row => {
            if (row[0] != undefined) { // make sure we don't grab an empty line
                let columns = row.split(',');

                if (columns[0] === 'uID') return; // skip headers line

                teamKills.push(new TeamKill(columns[0], columns[1], columns[2], columns[3], columns[4], columns[5], columns[6], columns[7], columns[8]));
            }
        });
        callback(true);
    });
}

function readPlayerDataFile(callback) {
    playerDatas = []; // empty array

    fs.readFile('data/player_data.csv', 'utf8', function(err, data) {
        let rows = data.split('\r\n');

        let headers = rows[0].split(',');

        // arrays
        let newPlayerData = {};
        let player = [];
        let weapons = [];
        let kills = [];
        let aircraft = [];
        let losses = [];

        rows.forEach(row => {
            if (row != rows[0]) { // skip header row
                // empty temp arrays
                newPlayerData = [];
                player = [];
                weapons = [];
                kills = [];
                aircraft = [];
                losses = [];

                let columns = row.split(',');

                for (let i = 0; i < columns.length - 1; i++) {
                    if (columns[i] != '0') {
                        // regexps
                        let isWeapon = headers[i].match(/\bweapon/);
                        let isKill = headers[i].match(/kills/);
                        let isAircraft = headers[i].match(/Time/);
                        let isLoss = headers[i].match(/loss/);

                        if (isWeapon) {
                            weapons[headers[i]] = columns[i];
                        } else if (isKill) {
                            kills[headers[i]] = columns[i];
                        } else if (isAircraft) {
                            aircraft[headers[i]] = columns[i];
                        } else if (isLoss) {
                            losses[headers[i]] = columns[i];
                        } else {
                            player[headers[i]] = [columns[i]];
                        }
                    }
                }

                newPlayerData["player"] = player;
                newPlayerData["weapons"] = weapons;
                newPlayerData["kills"] = kills;
                newPlayerData["aircraft"] = aircraft;
                newPlayerData["losses"] = losses;

                playerDatas.push(newPlayerData);
            }
        });

        callback(true);
    });
}
// </editor-fold desc='Functions'>

module.exports = router;