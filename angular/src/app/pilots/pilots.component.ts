import { Component, OnInit } from '@angular/core';
import {PilotsService} from '../services/pilots.service';
import {Pilot} from '../classes/pilot';
import {Observable, of, Subject} from 'rxjs/index';

@Component({
  selector: 'app-pilots',
  templateUrl: './pilots.component.html',
  styleUrls: ['./pilots.component.css']
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];
  displayPilots: Pilot[] = [];
  selectedPilot: Pilot;
  private searchTerm;

  constructor(
    private pilotService: PilotsService
  ) { }

  ngOnInit() {
    // this.getPilots();
  }

  getPilots(): void {
    this.pilotService.getPilots().subscribe(servicePilots => {
      this.pilots = servicePilots;
    });
  }

  onSelect(pilot: Pilot) {
    this.selectedPilot = pilot;
  }

  // searchPilots(searchTerm: string): Observable<any> {
  //   if (!searchTerm.trim()) {
  //     return of(this.pilots);
  //   }
  //   return of(this.pilots.find(pilot => {
  //     pilot.name.search(searchTerm);
  //   }));
  // }

  test(): any {

  }

  search(term: string): any {
    this.searchTerm = term;
  }
}
