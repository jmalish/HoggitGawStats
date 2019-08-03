import * as express from 'express';
import * as fs from 'fs';

let Pilot = require('./classes/Pilot');
let TeamKill = require('./classes/TeamKill');

let router = express.Router();

let pilots: Pilot[] = [];
let teamKills: TeamKill[] = [];
let playersData = [];

readNamesFile(_ => {});
readTeamKillsFile(_ => {});
readPlayerDataFile(_ => {
    console.log(playersData[0].player["uID"]);
    // console.log(JSON.stringify(playersData[0]));
});

router.get('/test', function (req, res, next) {
    res.send('test!');
});

router.get('/pilots', function (req, res, next) {
    res.json(pilots);
});

router.get('/pilot/:ucid', function (req, res, next) {
    let pilotUcid = req.params.ucid;

    let findPilot = pilots.find(function (pilot) {
        return pilot.ucid === pilotUcid;
    });

    res.json(findPilot);
});

router.get('/playerData/:ucid', function (req, res, next) {
    let requestedUcid = req.params.ucid;

    // let findPilot = playerDatas.find(function (pData) { // TODO: This isn't working correctly, just returns an empty array
    //     playerDatas[0][0].value.forEach(entry => {
    //         if (entry.key === 'uID') {
    //             return entry.value = requestedUcid;
    //         }
    //     })
    // });

    // console.log(findPilot);

    // res.send(findPilot);
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
    playersData = []; // empty array

    fs.readFile('data/player_data.csv', 'utf8', function(err, data) {
        let rows = data.split('\r\n');

        let headers = rows[0].split(',');

        rows.forEach(row => {
            if (row != rows[0]) { // skip header row
                // temp local arrays
                let player = {};
                let weapons = {};
                let kills = {};
                let aircraft = {};
                let losses = {};

                let columns = row.split(',');

                for (let i = 0; i < columns.length - 1; i++) {
                    if (columns[i] != '0') {
                        if (headers[i].match(/\bweapon/)) { // isWeapon
                            weapons[headers[i]] = columns[i];
                        } else if (headers[i].match(/kills/)) { // isKill
                            kills[headers[i]] = columns[i];
                        } else if (headers[i].match(/Time/)) { // isAircraft
                            aircraft[headers[i]] = columns[i];
                        } else if (headers[i].match(/loss/)) { // isLoss
                            losses[headers[i]] = columns[i];
                        } else { // otherwise it's player data (uID, and slID)
                            player[headers[i]] = columns[i];
                        }
                    }
                }

                const newPlayerData = {
                    player,
                    weapons,
                    kills,
                    aircraft,
                    losses
                };

                playersData.push(newPlayerData);
            }
        });

        callback(true);
    });
}

// </editor-fold desc='Functions'>

module.exports = router;