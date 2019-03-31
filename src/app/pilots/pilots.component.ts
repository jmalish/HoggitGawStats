import { Component, OnInit } from '@angular/core';
import {PilotsService} from '../services/pilots.service';
import {Pilot} from '../classes/pilot';

@Component({
  selector: 'app-pilots',
  templateUrl: './pilots.component.html',
  styleUrls: ['./pilots.component.css']
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];

  constructor(
    private pilotService: PilotsService
  ) { }

  ngOnInit() {
  }

  getPilots(): void {
    this.pilotService.getPilots().subscribe(servicePilots => {this.pilots = servicePilots});
  }

  test(): void {
    const test = this.pilots.find(pilot => pilot.name === 'name5');

    if (!test) {
      console.log('new');
    } else {
      console.log('exists');
    }
  }

  showPilots(): void {
    console.log(this.pilots);
  }

  clearPilots(): void {
    this.pilotService.pilots = [];
    console.log('pilots cleared');
  }
}
