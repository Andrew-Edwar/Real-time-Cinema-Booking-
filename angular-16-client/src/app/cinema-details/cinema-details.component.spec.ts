import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialDetailsComponent } from './cinema-details.component';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent;
  let fixture: ComponentFixture<TutorialDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialDetailsComponent]
    });
    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
