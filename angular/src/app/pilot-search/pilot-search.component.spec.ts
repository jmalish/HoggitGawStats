import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotSearchComponent } from './pilot-search.component';

describe('PilotSearchComponent', () => {
  let component: PilotSearchComponent;
  let fixture: ComponentFixture<PilotSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
