class TeamKill {
    perpetrator_uID: string;
    forgiven: boolean;
    objCat: string;
    weaponUsed: string;
    time: number;
    objTypeName: string; // airframe used
    shotFrom: string;
    perpetrator_slID: number;
    victim_uID: string;

    constructor(_perpetrator_uID, _forgiven, _objCat, _weaponUsed, _time, _objTypeName, _shotFrom, _perpetrator_slID, _victim_uID) {
        _forgiven === '' ? this.forgiven = false : this.forgiven = true;
        _shotFrom === '' ? this.shotFrom = 'UFO' : this.shotFrom = _shotFrom;

        this.perpetrator_uID = _perpetrator_uID;
        this.objCat = _objCat;
        this.weaponUsed = _weaponUsed;
        this.time = _time;
        this.objTypeName = _objTypeName;
        // this.shotFrom = _shotFrom;
        this.perpetrator_slID = _perpetrator_slID;
        this.victim_uID = _victim_uID;
    }
}

module.exports = TeamKill;