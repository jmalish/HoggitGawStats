import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs/index';
import {Pilot} from '../classes/pilot';
import {PilotsService} from '../services/pilots.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pilot-search',
  templateUrl: './pilot-search.component.html',
  styleUrls: ['./pilot-search.component.css']
})
export class PilotSearchComponent implements OnInit {
  allPilots: Pilot[];
  pilots$: Observable<Pilot[]>;
  private searchTerms = new Subject<string>();
  private searched = false;

  constructor(
    private pilotService: PilotsService,
    private router: Router
  ) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() { // TODO: Need to figure out how to make a list show up on page load
    this.pilots$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.pilotService.searchPilots(term))
    );
  }

  goToPilot(ucid: string): void {
    this.router.navigate(['/pilot', ucid]);
  }
}
