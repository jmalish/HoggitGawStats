import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pilot} from '../classes/pilot';
import * as Secrets from '../../secrets.json';
import {Observable, of} from 'rxjs/index';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PilotsService {
  //noinspection TypeScriptUnresolvedVariable
  private monitoring = Secrets.default.monitoring;
  pilots: Pilot[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getPilots(): Observable<Pilot[]> {
    const params = new HttpParams()
      .set('u', this.monitoring.user)
      .set('p', this.monitoring.pass)
      .set('q', 'SELECT "message" FROM "telegraf"."autogen"."syslog" WHERE time > now() - 1d AND message =~ /ALLOWING/');
    // TODO: This only gets last 1 day worth of history

    return this.http.get<any>(this.monitoring.url, {params}).pipe(
      map(res => {
        // noinspection TypeScriptUnresolvedVariable
        const allows = res.results[0].series[0].values; // put the http results into a less messy format
        const regexp = new RegExp('player: (.+) side:. slot:.+ ucid: (.+)'); // create regex

        this.pilots = []; // clear current pilots array so we don't double up
        allows.forEach((allow) => { // foreach /thing/ in the http results
          const regMatch = allow[1].match(regexp); // get the regex match, which includes the groups

          const newPilot = new Pilot(regMatch[2], regMatch[1]); // create temp pilot object
          const testForExistingPilot = this.pilots.find(pilot => pilot.ucid === newPilot.ucid); // search through existing pilots

          if (testForExistingPilot) { // if this is not null, the pilot already exists
            if (testForExistingPilot.name !== newPilot.name) { // if the two names don't match, we add an alias
              // testForExistingPilot new equals an existing pilot in the array
              const testAliases = testForExistingPilot.aliases.find(alias => alias === newPilot.name);

              if (!testAliases) { // if the returned array is empty, the name does not exist in aliases yet
                testForExistingPilot.aliases.push(newPilot.name);
              }
            } // otherwise do nothing
          } else { // else pilot does not exist, so we should add it
            this.pilots.push(newPilot);
          }
        }); // end of forEach

        return this.pilots;
      })
    );
  } // end of getPilots()
} // end of PilotService class
