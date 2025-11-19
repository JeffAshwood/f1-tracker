import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonCurrent } from './season-current';

describe('SeasonCurrent', () => {
  let component: SeasonCurrent;
  let fixture: ComponentFixture<SeasonCurrent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonCurrent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonCurrent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
