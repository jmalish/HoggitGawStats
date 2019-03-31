import { Component, OnInit } from '@angular/core';
import * as secrets from '../../secrets.json';  // access password with secrets.chronopass

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
