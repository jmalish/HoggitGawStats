import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pilot} from '../classes/pilot';
import {Observable, of} from 'rxjs/index';
import {map, tap} from 'rxjs/operators';
import * as secrets from '../../../../secrets.json'; // can ignore module warning

@Injectable({
  providedIn: 'root'
})
export class PilotsService {
  //noinspection TypeScriptUnresolvedVariable
  // private monitoring = Secrets.monitoring;
  pilots: Pilot[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getAllPilots(): Observable<Pilot[]> { // TODO: Setup way to force update of pilots, maybe check ages of pilots array
    if (this.pilots.length > 0) { // Keep from getting pilots every time the page is loaded, if we already have them
      // console.log('already have pilots');
      return of(this.pilots);
    }

    return this.http.get<any>('http://localhost:' + secrets.localserver.port + '/pilots').pipe(
      map(res => {
        this.pilots = []; // clear current pilots array so we don't double up

        res.forEach(pilot => {
          // console.log(pilot);
          this.pilots.push(pilot);
        });

        return this.pilots;
      })
    );
  } // end of getAllPilots()

  getPilotByUcid(ucid: string): Observable<Pilot> {
    return this.http.get<any>('http://localhost:' + secrets.localserver.port + '/pilot/' + ucid).pipe(
      map(res => {
        return res;
      })
    );
  }
} // end of PilotService class
