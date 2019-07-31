export class Pilot {
  ucid: string;
  name: string;
  aliases: string[] = [];

  constructor(Ucid: string, Name: string, Aliases: string[]) {
    this.ucid = Ucid;
    this.name = Name;
    this.aliases = Aliases;
  }
}
