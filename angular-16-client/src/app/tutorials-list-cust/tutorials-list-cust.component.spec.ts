import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsListComponentCust } from './tutorials-list-cust.component';

describe('TutorialsListComponentCust', () => {
  let component: TutorialsListComponentCust;
  let fixture: ComponentFixture<TutorialsListComponentCust>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialsListComponentCust]
    });
    fixture = TestBed.createComponent(TutorialsListComponentCust);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
