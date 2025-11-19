import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, DriverStanding, ConstructorStanding, Meeting, RaceResult } from '../../core/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';

@Component({
  selector: 'app-season-current',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  template: `
    <div class="container">
      <div class="header-section">
        <h1>2025 Season</h1>
        <div class="tabs">
          <button [class.active]="activeTab === 'drivers'" (click)="activeTab = 'drivers'">Drivers</button>
          <button [class.active]="activeTab === 'constructors'" (click)="activeTab = 'constructors'">Constructors</button>
          <button [class.active]="activeTab === 'schedule'" (click)="activeTab = 'schedule'">Schedule</button>
        </div>
      </div>

      <div class="content-section">
        <!-- Drivers Standings -->
        <div *ngIf="activeTab === 'drivers'" class="standings-table fade-in">
          <div class="table-header">
            <span class="pos">POS</span>
            <span class="driver">DRIVER</span>
            <span class="team">TEAM</span>
            <span class="pts">PTS</span>
          </div>
          <div class="table-row" *ngFor="let driver of driverStandings$ | async">
            <span class="pos">{{ driver.position }}</span>
            <div class="driver">
              <span class="name">{{ driver.Driver.givenName }} {{ driver.Driver.familyName }}</span>
            </div>
            <span class="team">{{ driver.Constructors[0].name }}</span>
            <span class="pts">{{ driver.points }}</span>
          </div>
        </div>

        <!-- Constructors Standings -->
        <div *ngIf="activeTab === 'constructors'" class="standings-table fade-in">
          <div class="table-header">
            <span class="pos">POS</span>
            <span class="team-col">TEAM</span>
            <span class="pts">PTS</span>
            <span class="wins">WINS</span>
          </div>
          <div class="table-row" *ngFor="let team of constructorStandings$ | async">
            <span class="pos">{{ team.position }}</span>
            <span class="team-col">{{ team.Constructor.name }}</span>
            <span class="pts">{{ team.points }}</span>
            <span class="wins">{{ team.wins }}</span>
          </div>
        </div>

        <!-- Schedule -->
        <div *ngIf="activeTab === 'schedule'" class="fade-in">
          <div class="schedule-controls">
            <label class="toggle-container">
              <input type="checkbox" [(ngModel)]="hideFinishedRaces" (change)="filterRaces()">
              <span class="toggle-label">Hide finished races</span>
            </label>
          </div>
          
          <div class="schedule-grid">
            <div class="race-card-container" *ngFor="let race of filteredMeetings$ | async; let i = index">
              <div class="race-card" 
                   [class.past-race]="isRaceFinished(race.date_start)"
                   [class.flipped]="flippedCards[i]"
                   (click)="isRaceFinished(race.date_start) ? toggleCard(i, race.meeting_key) : null"
                   [style.cursor]="isRaceFinished(race.date_start) ? 'pointer' : 'default'">
                
                <!-- Front of card -->
                <div class="card-face card-front">
                  <div class="race-header">
                    <span class="round">ROUND {{ race.meeting_key }}</span>
                    <span class="date">{{ race.date_start | date:'d MMM' }}</span>
                  </div>
                  <div class="race-body">
                    <h3>{{ race.meeting_name }}</h3>
                    <p class="location">{{ race.location }}, {{ race.country_name }}</p>
                    <div class="status-row" *ngIf="!isRaceFinished(race.date_start)">
                      <span class="race-status upcoming">UPCOMING</span>
                      <a [href]="getGoogleCalendarUrl(race)" 
                         target="_blank" 
                         class="calendar-btn"
                         (click)="$event.stopPropagation()">
                        📅 Add to Calendar
                      </a>
                    </div>
                    <div *ngIf="isRaceFinished(race.date_start)">
                      <span class="race-status">FINISHED</span>
                      <p class="flip-hint">Click to see results</p>
                    </div>
                  </div>
                </div>

                <!-- Back of card -->
                <div class="card-face card-back">
                  <div class="race-header">
                    <span class="round">RESULTS</span>
                    <span class="date">{{ race.date_start | date:'d MMM' }}</span>
                  </div>
                  <div class="race-body">
                    <h3>{{ race.meeting_name }}</h3>
                    <div class="results-list" *ngIf="raceResults[i] as results">
                      <div class="result-item" *ngFor="let result of results" [class.winner]="result.position === '1'">
                        <span class="position">{{ result.position }}</span>
                        <div class="driver-result">
                          <span class="driver-name">{{ result.Driver.givenName }} {{ result.Driver.familyName }}</span>
                          <span class="team-name">{{ result.Constructor.name }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="loading-results" *ngIf="!raceResults[i]">Loading results...</div>
                    <p class="flip-hint">Click to go back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      margin-bottom: 30px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    .tabs {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
    }
    button {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1rem;
      padding: 10px 20px;
      cursor: pointer;
      transition: color 0.3s, border-bottom 0.3s;
    }
    button:hover {
      color: var(--text-color);
    }
    button.active {
      color: var(--accent-color);
      border-bottom: 2px solid var(--accent-color);
    }
    .table-header {
      display: flex;
      padding: 15px;
      background-color: #2a2a2a;
      border-radius: 8px 8px 0 0;
      font-weight: 700;
      color: var(--text-secondary);
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
    .table-row {
      display: flex;
      padding: 15px;
      background-color: var(--card-bg);
      border-bottom: 1px solid #333;
      align-items: center;
      transition: background-color 0.2s;
    }
    .table-row:last-child {
      border-bottom: none;
      border-radius: 0 0 8px 8px;
    }
    .table-row:hover {
      background-color: #252525;
    }
    .pos { width: 50px; font-weight: 700; color: var(--accent-color); }
    .driver { flex: 2; font-weight: 600; }
    .team { flex: 1; color: var(--text-secondary); }
    .team-col { flex: 2; font-weight: 600; }
    .pts { width: 80px; font-weight: 700; text-align: right; }
    .wins { width: 80px; text-align: right; color: var(--text-secondary); }

    .schedule-controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      padding: 10px 0;
    }
    .toggle-container {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .toggle-container input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--accent-color);
    }
    .toggle-label {
      font-size: 0.95rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .toggle-container:hover .toggle-label {
      color: var(--text-color);
    }
    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .race-card-container {
      perspective: 1000px;
      height: 200px;
    }
    .race-card {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .race-card.flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-color: var(--card-bg);
      border-radius: 8px;
      overflow: hidden;
    }
    .card-front {
      transform: rotateY(0deg);
    }
    .card-back {
      transform: rotateY(180deg);
    }
    .race-card.past-race .card-face {
      opacity: 0.5;
      transition: opacity 0.3s;
    }
    .race-card.past-race:hover .card-face {
      opacity: 0.7;
    }
    .race-header {
      background-color: #2a2a2a;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .race-body {
      padding: 12px 15px;
      position: relative;
    }
    .race-body h3 {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
    }
    .location {
      margin: 0 0 8px 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .race-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      background-color: #444;
      color: #999;
    }
    .race-status.upcoming {
      background-color: rgba(225, 6, 0, 0.2);
      color: var(--accent-color);
    }
    .status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    }
    .flip-hint {
      margin-top: 10px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-style: italic;
    }
    .calendar-btn {
      display: inline-block;
      padding: 8px 16px;
      background-color: var(--accent-color);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background-color 0.3s, transform 0.2s;
      white-space: nowrap;
    }
    .calendar-btn:hover {
      background-color: #d10600;
      transform: translateY(-2px);
    }
    .results-list {
      margin-top: 8px;
    }
    .result-item {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      margin-bottom: 4px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      border-left: 3px solid #444;
    }
    .result-item.winner {
      border-left-color: var(--accent-color);
      background-color: rgba(225, 6, 0, 0.1);
    }
    .result-item .position {
      font-size: 1rem;
      font-weight: 700;
      width: 25px;
      color: var(--accent-color);
    }
    .driver-result {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .driver-name {
      font-weight: 600;
      font-size: 0.85rem;
      line-height: 1.2;
    }
    .team-name {
      font-size: 0.7rem;
      color: var(--text-secondary);
      line-height: 1.2;
    }
    .loading-results {
      margin-top: 15px;
      text-align: center;
      color: var(--text-secondary);
      font-style: italic;
    }
    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 600px) {
      .team { display: none; }
      .wins { display: none; }
    }
  `]
})
export class SeasonCurrentComponent implements OnInit {
  activeTab: 'drivers' | 'constructors' | 'schedule' = 'drivers';
  driverStandings$: Observable<DriverStanding[]>;
  constructorStandings$: Observable<ConstructorStanding[]>;
  meetings$: Observable<Meeting[]>;
  filteredMeetings$: Observable<Meeting[]>;
  flippedCards: { [key: number]: boolean } = {};
  raceResults: { [key: number]: RaceResult[] } = {};
  hideFinishedRaces: boolean = false;
  private filterSubject = new BehaviorSubject<boolean>(false);

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.driverStandings$ = this.api.getDriverStandings();
    this.constructorStandings$ = this.api.getConstructorStandings();
    this.meetings$ = this.api.getMeetings(2025);

    // Set up filtered meetings observable
    this.filteredMeetings$ = this.meetings$.pipe(
      combineLatest(this.filterSubject),
      map(([meetings, hideFinished]) => {
        if (hideFinished) {
          return meetings.filter(m => !this.isRaceFinished(m.date_start));
        }
        return meetings;
      })
    );
  }

  ngOnInit() {
    // Check for URL fragment to set initial tab
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'schedule' || fragment === 'drivers' || fragment === 'constructors') {
        this.activeTab = fragment as 'drivers' | 'constructors' | 'schedule';
      }
    });
  }

  isRaceFinished(dateStart: string): boolean {
    const raceDate = new Date(dateStart);
    const now = new Date();
    return raceDate < now;
  }

  filterRaces() {
    this.filterSubject.next(this.hideFinishedRaces);
  }

  toggleCard(index: number, round: number) {
    this.flippedCards[index] = !this.flippedCards[index];

    // Fetch results if not already loaded and card is being flipped to show results
    if (this.flippedCards[index] && !this.raceResults[index]) {
      this.api.getRaceResults(2025, round).subscribe(results => {
        this.raceResults[index] = results;
      });
    }
  }

  getGoogleCalendarUrl(race: Meeting): string {
    const title = encodeURIComponent(`🏎️ ${race.meeting_name} 🏎️`);
    const location = encodeURIComponent(`${race.circuit_short_name}, ${race.location}, ${race.country_name}`);
    const details = encodeURIComponent(`Formula 1 - ${race.meeting_name}\\nCircuit: ${race.circuit_short_name}`);

    // Parse the race start time
    const startDate = new Date(race.date_start);
    // Race typically lasts 2 hours
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }
}
