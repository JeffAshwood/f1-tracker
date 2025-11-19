import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonNext } from './season-next';

describe('SeasonNext', () => {
  let component: SeasonNext;
  let fixture: ComponentFixture<SeasonNext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonNext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonNext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
