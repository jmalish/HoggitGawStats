export class Pilot {
  ucid: string;
  name: string;
  aliases: string[] = [];

  constructor(Ucid: string, Name: string) {
    this.ucid = Ucid;
    this.name = Name;
  }

  addAlias(Name: string): void {
    this.aliases.push(Name);
  }
}
