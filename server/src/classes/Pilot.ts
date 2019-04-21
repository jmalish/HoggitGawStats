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

module.exports = Pilot;