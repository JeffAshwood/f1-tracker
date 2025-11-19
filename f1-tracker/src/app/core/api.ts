import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructors: {
    constructorId: string;
    name: string;
    nationality: string;
  }[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_name: string;
  date_start: string;
  year: number;
  circuit_short_name: string;
}

export interface Session {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  session_type: string;
  meeting_key: number;
}

export interface RaceResult {
  position: string;
  Driver: {
    driverId: string;
    code: string;
    givenName: string;
    familyName: string;
  };
  Constructor: {
    name: string;
  };
  Time?: {
    time: string;
  };
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jolpicaUrl = 'https://api.jolpi.ca/ergast/f1';
  private openF1Url = 'https://api.openf1.org/v1';

  constructor(private http: HttpClient) { }

  getDriverStandings(): Observable<DriverStanding[]> {
    return this.http.get<any>(`${this.jolpicaUrl}/current/driverStandings.json`).pipe(
      map(response => {
        if (response.MRData && response.MRData.StandingsTable && response.MRData.StandingsTable.StandingsLists && response.MRData.StandingsTable.StandingsLists.length > 0) {
          return response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching driver standings:', error);
        return of([]);
      })
    );
  }

  getConstructorStandings(): Observable<ConstructorStanding[]> {
    return this.http.get<any>(`${this.jolpicaUrl}/current/constructorStandings.json`).pipe(
      map(response => {
        if (response.MRData && response.MRData.StandingsTable && response.MRData.StandingsTable.StandingsLists && response.MRData.StandingsTable.StandingsLists.length > 0) {
          return response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching constructor standings:', error);
        return of([]);
      })
    );
  }

  getMeetings(year: number): Observable<Meeting[]> {
    return this.http.get<any>(`${this.jolpicaUrl}/${year}.json`).pipe(
      map(response => {
        if (response.MRData && response.MRData.RaceTable && response.MRData.RaceTable.Races) {
          return response.MRData.RaceTable.Races.map((race: any) => ({
            meeting_key: parseInt(race.round),
            meeting_name: race.raceName,
            meeting_official_name: race.raceName, // Jolpica doesn't have official name, use raceName
            location: race.Circuit.Location.locality,
            country_name: race.Circuit.Location.country,
            date_start: `${race.date}T${race.time}`,
            year: parseInt(race.season),
            circuit_short_name: race.Circuit.circuitName
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error(`Error fetching meetings for year ${year}:`, error);
        return of([]);
      })
    );
  }

  getSessions(meetingKey: number): Observable<Session[]> {
    // OpenF1 is still best for detailed session times if we had the meeting_key match,
    // but since we switched to Jolpica for meetings, we might not have matching keys for OpenF1.
    // For now, we will keep this as is, but note that it might not work with Jolpica round numbers.
    // A better approach for the future would be to use Jolpica's detailed race data if available,
    // or just rely on the start time we have.
    // For the scope of "Upcoming Races" on home, we just need the meeting data.
    return this.http.get<Session[]>(`${this.openF1Url}/sessions?meeting_key=${meetingKey}`).pipe(
      catchError(error => {
        console.error(`Error fetching sessions for meeting ${meetingKey}:`, error);
        return of([]);
      })
    );
  }

  getNextRaces(): Observable<Meeting[]> {
    const currentYear = new Date().getFullYear();
    // Fetch 2025 specifically as requested for "Next Season" / Upcoming
    return this.getMeetings(2025).pipe(
      map(meetings => {
        const now = new Date();
        // Filter for future races
        return meetings
          .filter(m => new Date(m.date_start) > now)
          .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
      }),
      catchError(error => {
        console.error('Error fetching next races:', error);
        return of([]);
      })
    );
  }

  getRaceResults(year: number, round: number): Observable<RaceResult[]> {
    return this.http.get<any>(`${this.jolpicaUrl}/${year}/${round}/results.json`).pipe(
      map(response => {
        if (response.MRData && response.MRData.RaceTable && response.MRData.RaceTable.Races && response.MRData.RaceTable.Races.length > 0) {
          const results = response.MRData.RaceTable.Races[0].Results;
          // Return only top 3
          return results ? results.slice(0, 3) : [];
        }
        return [];
      }),
      catchError(error => {
        console.error(`Error fetching results for ${year} round ${round}:`, error);
        return of([]);
      })
    );
  }
}
