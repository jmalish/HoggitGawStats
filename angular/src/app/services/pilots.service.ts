import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pilot} from '../classes/pilot';
import {Observable, of} from 'rxjs/index';
import {map, tap} from 'rxjs/operators';

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

  getPilots(): Observable<Pilot[]> {
    return this.http.get<any>('http://localhost:4201/pilots').pipe(
      map(res => {
        this.pilots = []; // clear current pilots array so we don't double up

        res.forEach(pilot => {
          this.pilots.push(pilot);
        });

        return this.pilots;
      })
    );

    // return of(new Pilot('a', 'a')); // temp to avoid error
  } // end of getPilots()
} // end of PilotService class
