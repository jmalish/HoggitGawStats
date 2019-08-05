import { Component, OnInit } from '@angular/core';
import {Observable, of, Subject} from 'rxjs/index';
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
  allPilots: Pilot[] = [];
  pilots$: Observable<Pilot[]>;
  private searchTerms = new Subject<string>();
  private isSearching = false;
  private initialSearched = false;

  constructor(
    private pilotService: PilotsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPilots();

    this.pilots$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.pilotService.searchPilots(term))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);

    this.initialSearched = true;
    this.isSearching = term !== '';
  }

  goToPilot(ucid: string): void {
    this.router.navigate(['/pilot', ucid]);
  }

  getPilots(): void {
    this.pilotService.getAllPilots().subscribe(pilots => this.allPilots = pilots);
  }
}
