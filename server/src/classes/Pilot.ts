class Pilot {
    name: string;
    ucid: string;
    slID: string;
    aliases: string[] = [];

    constructor(_name, _ucid, _slID) {
        this.name = _name;
        this.ucid = _ucid;
        this.slID = _slID;
    }

    addAlias(_name) {
        this.aliases.push(_name);
    }
}

module.exports = Pilot;