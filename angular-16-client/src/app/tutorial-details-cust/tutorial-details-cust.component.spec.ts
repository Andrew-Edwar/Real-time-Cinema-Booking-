import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialDetailsComponentCust } from './tutorial-details-cust.component';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponentCust;
  let fixture: ComponentFixture<TutorialDetailsComponentCust>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialDetailsComponentCust]
    });
    fixture = TestBed.createComponent(TutorialDetailsComponentCust);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
