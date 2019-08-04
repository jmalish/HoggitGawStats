import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { PilotsComponent } from './pilots/pilots.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {HttpClientModule} from '@angular/common/http';
import { PilotDetailComponent } from './pilot-detail/pilot-detail.component';
import {FormsModule} from '@angular/forms';
import { PilotSearchComponent } from './pilot-search/pilot-search.component';

@NgModule({
  declarations: [
    AppComponent,
    // PilotsComponent,
    DashboardComponent,
    PilotDetailComponent,
    PilotSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
