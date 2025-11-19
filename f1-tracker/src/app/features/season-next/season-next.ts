import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService, Meeting } from '../../core/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-season-next',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="container">
      <div class="header-section">
        <h1>2026 Season Preview</h1>
        <p class="subtitle">Confirmed Calendar - 24 Races</p>
      </div>

      <div class="timeline">
        <div class="timeline-item" *ngFor="let race of meetings$ | async; let i = index">
          <div class="timeline-marker"></div>
          <div class="timeline-content card">
            <div class="race-header">
              <span class="round">ROUND {{ i + 1 }}</span>
              <span class="date">{{ race.date_start | date:'d MMMM y' }}</span>
            </div>
            <div class="race-body">
              <h2>{{ race.meeting_name }}</h2>
              <p class="location">{{ race.location }}, {{ race.country_name }}</p>
              <div class="circuit-row">
                <div class="circuit-info">
                  <span class="circuit">{{ race.circuit_short_name }}</span>
                </div>
                <a [href]="getGoogleCalendarUrl(race, i + 1)" 
                   target="_blank" 
                   class="calendar-btn">
                  📅 Add to Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      text-align: center;
      margin-bottom: 50px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 10px;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.2rem;
    }
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }
    .timeline::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 20px;
      width: 2px;
      background: #333;
    }
    .timeline-item {
      position: relative;
      padding-left: 50px;
      margin-bottom: 30px;
    }
    .timeline-marker {
      position: absolute;
      left: 11px;
      top: 20px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg-color);
      border: 3px solid var(--accent-color);
      z-index: 1;
    }
    .timeline-content {
      transition: transform 0.3s;
    }
    .timeline-content:hover {
      transform: translateX(10px);
    }
    .race-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: var(--accent-color);
      font-weight: 700;
      font-size: 0.9rem;
    }
    .date {
      color: var(--text-secondary);
    }
    h2 {
      margin: 0 0 5px 0;
      font-size: 1.5rem;
    }
    .location {
      margin: 0 0 15px 0;
      color: var(--text-secondary);
    }
    .circuit-info {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .circuit-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
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
  `]
})
export class SeasonNextComponent implements OnInit {
  meetings$: Observable<Meeting[]>;

  private races2026: Meeting[] = [
    { meeting_key: 1, meeting_name: 'Australian Grand Prix', meeting_official_name: 'Australian Grand Prix', location: 'Melbourne', country_name: 'Australia', date_start: '2026-03-08T04:00:00Z', year: 2026, circuit_short_name: 'Albert Park Circuit' },
    { meeting_key: 2, meeting_name: 'Chinese Grand Prix', meeting_official_name: 'Chinese Grand Prix', location: 'Shanghai', country_name: 'China', date_start: '2026-03-15T07:00:00Z', year: 2026, circuit_short_name: 'Shanghai International Circuit' },
    { meeting_key: 3, meeting_name: 'Japanese Grand Prix', meeting_official_name: 'Japanese Grand Prix', location: 'Suzuka', country_name: 'Japan', date_start: '2026-03-29T06:00:00Z', year: 2026, circuit_short_name: 'Suzuka Circuit' },
    { meeting_key: 4, meeting_name: 'Bahrain Grand Prix', meeting_official_name: 'Bahrain Grand Prix', location: 'Sakhir', country_name: 'Bahrain', date_start: '2026-04-12T14:00:00Z', year: 2026, circuit_short_name: 'Bahrain International Circuit' },
    { meeting_key: 5, meeting_name: 'Saudi Arabian Grand Prix', meeting_official_name: 'Saudi Arabian Grand Prix', location: 'Jeddah', country_name: 'Saudi Arabia', date_start: '2026-04-19T17:00:00Z', year: 2026, circuit_short_name: 'Jeddah Corniche Circuit' },
    { meeting_key: 6, meeting_name: 'Miami Grand Prix', meeting_official_name: 'Miami Grand Prix', location: 'Miami', country_name: 'USA', date_start: '2026-05-03T19:00:00Z', year: 2026, circuit_short_name: 'Miami International Autodrome' },
    { meeting_key: 7, meeting_name: 'Canadian Grand Prix', meeting_official_name: 'Canadian Grand Prix', location: 'Montreal', country_name: 'Canada', date_start: '2026-05-24T18:00:00Z', year: 2026, circuit_short_name: 'Circuit Gilles Villeneuve' },
    { meeting_key: 8, meeting_name: 'Monaco Grand Prix', meeting_official_name: 'Monaco Grand Prix', location: 'Monte Carlo', country_name: 'Monaco', date_start: '2026-06-07T13:00:00Z', year: 2026, circuit_short_name: 'Circuit de Monaco' },
    { meeting_key: 9, meeting_name: 'Spanish Grand Prix', meeting_official_name: 'Spanish Grand Prix', location: 'Barcelona', country_name: 'Spain', date_start: '2026-06-14T13:00:00Z', year: 2026, circuit_short_name: 'Circuit de Barcelona-Catalunya' },
    { meeting_key: 10, meeting_name: 'Austrian Grand Prix', meeting_official_name: 'Austrian Grand Prix', location: 'Spielberg', country_name: 'Austria', date_start: '2026-06-28T13:00:00Z', year: 2026, circuit_short_name: 'Red Bull Ring' },
    { meeting_key: 11, meeting_name: 'British Grand Prix', meeting_official_name: 'British Grand Prix', location: 'Silverstone', country_name: 'United Kingdom', date_start: '2026-07-05T14:00:00Z', year: 2026, circuit_short_name: 'Silverstone Circuit' },
    { meeting_key: 12, meeting_name: 'Belgian Grand Prix', meeting_official_name: 'Belgian Grand Prix', location: 'Spa-Francorchamps', country_name: 'Belgium', date_start: '2026-07-19T14:00:00Z', year: 2026, circuit_short_name: 'Circuit de Spa-Francorchamps' },
    { meeting_key: 13, meeting_name: 'Hungarian Grand Prix', meeting_official_name: 'Hungarian Grand Prix', location: 'Budapest', country_name: 'Hungary', date_start: '2026-07-26T13:00:00Z', year: 2026, circuit_short_name: 'Hungaroring' },
    { meeting_key: 14, meeting_name: 'Dutch Grand Prix', meeting_official_name: 'Dutch Grand Prix', location: 'Zandvoort', country_name: 'Netherlands', date_start: '2026-08-23T13:00:00Z', year: 2026, circuit_short_name: 'Circuit Zandvoort' },
    { meeting_key: 15, meeting_name: 'Italian Grand Prix', meeting_official_name: 'Italian Grand Prix', location: 'Monza', country_name: 'Italy', date_start: '2026-09-06T13:00:00Z', year: 2026, circuit_short_name: 'Autodromo Nazionale di Monza' },
    { meeting_key: 16, meeting_name: 'Madrid Grand Prix', meeting_official_name: 'Madrid Grand Prix', location: 'Madrid', country_name: 'Spain', date_start: '2026-09-13T13:00:00Z', year: 2026, circuit_short_name: 'Madrid Street Circuit' },
    { meeting_key: 17, meeting_name: 'Azerbaijan Grand Prix', meeting_official_name: 'Azerbaijan Grand Prix', location: 'Baku', country_name: 'Azerbaijan', date_start: '2026-09-27T12:00:00Z', year: 2026, circuit_short_name: 'Baku City Circuit' },
    { meeting_key: 18, meeting_name: 'Singapore Grand Prix', meeting_official_name: 'Singapore Grand Prix', location: 'Singapore', country_name: 'Singapore', date_start: '2026-10-11T12:00:00Z', year: 2026, circuit_short_name: 'Marina Bay Street Circuit' },
    { meeting_key: 19, meeting_name: 'United States Grand Prix', meeting_official_name: 'United States Grand Prix', location: 'Austin', country_name: 'USA', date_start: '2026-10-25T19:00:00Z', year: 2026, circuit_short_name: 'Circuit of the Americas' },
    { meeting_key: 20, meeting_name: 'Mexico City Grand Prix', meeting_official_name: 'Mexico City Grand Prix', location: 'Mexico City', country_name: 'Mexico', date_start: '2026-11-01T20:00:00Z', year: 2026, circuit_short_name: 'Autódromo Hermanos Rodríguez' },
    { meeting_key: 21, meeting_name: 'São Paulo Grand Prix', meeting_official_name: 'São Paulo Grand Prix', location: 'São Paulo', country_name: 'Brazil', date_start: '2026-11-08T17:00:00Z', year: 2026, circuit_short_name: 'Autódromo José Carlos Pace' },
    { meeting_key: 22, meeting_name: 'Las Vegas Grand Prix', meeting_official_name: 'Las Vegas Grand Prix', location: 'Las Vegas', country_name: 'USA', date_start: '2026-11-21T06:00:00Z', year: 2026, circuit_short_name: 'Las Vegas Strip Street Circuit' },
    { meeting_key: 23, meeting_name: 'Qatar Grand Prix', meeting_official_name: 'Qatar Grand Prix', location: 'Lusail', country_name: 'Qatar', date_start: '2026-11-29T14:00:00Z', year: 2026, circuit_short_name: 'Lusail International Circuit' },
    { meeting_key: 24, meeting_name: 'Abu Dhabi Grand Prix', meeting_official_name: 'Abu Dhabi Grand Prix', location: 'Abu Dhabi', country_name: 'UAE', date_start: '2026-12-06T13:00:00Z', year: 2026, circuit_short_name: 'Yas Marina Circuit' }
  ];

  constructor(private api: ApiService) {
    // Try API first, fallback to manual data if empty
    this.meetings$ = this.api.getMeetings(2026).pipe(
      switchMap(apiRaces => {
        if (apiRaces && apiRaces.length > 0) {
          return of(apiRaces);
        }
        // Fallback to manual 2026 data
        return of(this.races2026);
      })
    );
  }

  ngOnInit() { }

  getGoogleCalendarUrl(race: Meeting, round: number): string {
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
