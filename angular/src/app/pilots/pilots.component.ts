import { Component, OnInit } from '@angular/core';
import {PilotsService} from '../services/pilots.service';
import {Pilot} from '../classes/pilot';
import {Observable, of, Subject} from 'rxjs/index';
import {debounceTime} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pilots',
  templateUrl: './pilots.component.html',
  styleUrls: ['./pilots.component.css']
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];
  displayPilots: Pilot[] = [];
  // selectedPilot: Pilot;

  constructor(
    private pilotService: PilotsService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.pilots.length === 0) {
      this.getPilots();
    }
  }

  getPilots(): void {
    this.pilotService.getAllPilots().subscribe(servicePilots => {
      this.displayPilots = this.pilots = servicePilots;
    });
  }

  // onSelect(pilot: Pilot) {
  //   this.selectedPilot = pilot;
  // }

  searchPilots(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.displayPilots = this.pilots;
    } else {
      this.displayPilots = this.pilots.filter(pilot => pilot.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    }
  }

  test(): any {

  }

  goToPilot(ucid: string): void {
    this.router.navigate(['/pilot', ucid]);
  }
}
