import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pilot} from '../classes/pilot';
import {Observable, of} from 'rxjs/index';
import {map} from 'rxjs/operators';
import * as secrets from '../../../../secrets.json'; // can ignore module warning

@Injectable({
  providedIn: 'root'
})
export class PilotsService {
  private pilotsUrl = 'http://localhost:' + secrets.localserver.port;
  pilots: Pilot[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getPilotByUcid(ucid: string): Observable<Pilot> {
    return this.http.get<any>(this.pilotsUrl + '/pilot/' + ucid).pipe(
      map(res => {
        return res;
      })
    );
  }

  searchPilots(name: string): Observable<Pilot[]> {
    if (!name.trim()) {
      return this.getAllPilots();
    }

    return this.http.get<Pilot[]>(`${this.pilotsUrl}/pilots?search=${name}`);
  }

  getAllPilots(): any {
    if (this.pilots.length > 0) {return of(this.pilots); }

    this.http.get<Pilot[]>(`${this.pilotsUrl}/pilots`).subscribe(pilots => {
      return this.pilots = pilots;
    });
  }
} // end of PilotService class
