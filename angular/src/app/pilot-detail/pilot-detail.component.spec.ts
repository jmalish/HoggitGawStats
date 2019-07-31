import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotDetailComponent } from './pilot-detail.component';

describe('PilotDetailComponent', () => {
  let component: PilotDetailComponent;
  let fixture: ComponentFixture<PilotDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
