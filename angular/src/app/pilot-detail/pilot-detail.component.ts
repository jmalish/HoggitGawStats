import { Component, OnInit, OnDestroy } from '@angular/core';
import {Pilot} from '../classes/pilot';
import {ActivatedRoute} from '@angular/router';
import {PilotsService} from '../services/pilots.service';

@Component({
  selector: 'app-pilot-detail',
  templateUrl: './pilot-detail.component.html',
  styleUrls: ['./pilot-detail.component.css']
})
export class PilotDetailComponent implements OnInit, OnDestroy {
  ucid: string;
  private sub: any;
  private pilot: Pilot = new Pilot('', '', []);

  constructor(
    private route: ActivatedRoute,
    private pilotService: PilotsService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const key = 'ucid';
      this.ucid = params[key];
      this.getPilotDetails();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPilotDetails() {
    this.pilotService.getPilotByUcid(this.ucid).subscribe(pilot => {
      this.pilot = pilot;
    });
  }
}
