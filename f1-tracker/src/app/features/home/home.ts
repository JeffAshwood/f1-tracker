import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, DriverStanding, Meeting } from '../../core/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <div class="container">
      <div class="hero-section">
        <h1>Formula 1 Tracker</h1>
        <p class="subtitle">Live Timing & Standings</p>
      </div>

      <div class="grid-layout">
        <!-- Standings Card -->
        <div class="card standings-card">
          <h2>Driver Standings</h2>
          <div class="standings-list" *ngIf="driverStandings$ | async as standings; else loading">
            <div class="standing-item" *ngFor="let driver of standings | slice:0:5">
              <span class="position">{{ driver.position }}</span>
              <div class="driver-info">
                <span class="name">{{ driver.Driver.givenName }} {{ driver.Driver.familyName }}</span>
                <span class="team">{{ driver.Constructors[0].name }}</span>
              </div>
              <span class="points">{{ driver.points }} PTS</span>
            </div>
            <div class="view-more">
              <a routerLink="/season-current" class="btn-link">View Full Standings</a>
            </div>
          </div>
        </div>

        <!-- Next Races Card -->
        <div class="card schedule-card">
          <h2>Upcoming Races</h2>
          <div class="race-list" *ngIf="nextRaces$ | async as races; else loading">
            <div class="race-item" *ngFor="let race of races | slice:0:3">
              <div class="race-date">
                <span class="day">{{ race.date_start | date:'dd' }}</span>
                <span class="month">{{ race.date_start | date:'MMM' }}</span>
              </div>
              <div class="race-details">
                <span class="race-name">{{ race.meeting_name }}</span>
                <span class="location">{{ race.location }}, {{ race.country_name }}</span>
              </div>
              <div class="race-time">
                {{ race.date_start | date:'HH:mm' }}
              </div>
              <a [href]="getGoogleCalendarUrl(race)" 
                 target="_blank" 
                 class="calendar-btn-small"
                 title="Add to Google Calendar">
                📅
              </a>
            </div>
            <div class="view-more">
              <a routerLink="/season-current" fragment="schedule" class="btn-link">View Full Schedule</a>
            </div>
          </div>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">Loading data...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .hero-section {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 0;
      background: linear-gradient(180deg, rgba(225, 6, 0, 0.1) 0%, rgba(18, 18, 18, 0) 100%);
      border-radius: 12px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 10px;
      letter-spacing: -1px;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.2rem;
    }
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }
    .standings-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .standing-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      transition: transform 0.2s;
    }
    .standing-item:hover {
      transform: translateX(5px);
      background-color: rgba(255, 255, 255, 0.1);
    }
    .position {
      font-size: 1.2rem;
      font-weight: 700;
      width: 40px;
      color: var(--accent-color);
    }
    .driver-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .name {
      font-weight: 600;
    }
    .team {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .points {
      font-weight: 700;
    }
    .race-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .race-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      border-left: 3px solid var(--accent-color);
    }
    .race-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20px;
      min-width: 50px;
    }
    .day {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .month {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    .race-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .race-name {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .location {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .race-time {
      font-family: monospace;
      background: #333;
      padding: 5px 10px;
      border-radius: 4px;
    }
    .calendar-btn-small {
      margin-left: 10px;
      padding: 6px 10px;
      background-color: var(--accent-color);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 1.2rem;
      transition: background-color 0.3s, transform 0.2s;
    }
    .calendar-btn-small:hover {
      background-color: #d10600;
      transform: scale(1.1);
    }
    .view-more {
      margin-top: 15px;
      text-align: right;
    }
    .btn-link {
      color: var(--accent-color);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-link:hover {
      text-decoration: underline;
    }
    .loading {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
    }
  `]
})
export class HomeComponent implements OnInit {
  driverStandings$: Observable<DriverStanding[]>;
  nextRaces$: Observable<Meeting[]>;

  constructor(private api: ApiService) {
    this.driverStandings$ = this.api.getDriverStandings();
    this.nextRaces$ = this.api.getNextRaces();
  }

  ngOnInit() { }

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
