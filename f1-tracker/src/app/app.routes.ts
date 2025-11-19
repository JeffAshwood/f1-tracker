import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { SeasonCurrentComponent } from './features/season-current/season-current';
import { SeasonNextComponent } from './features/season-next/season-next';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'season-current', component: SeasonCurrentComponent },
    { path: 'season-next', component: SeasonNextComponent },
    { path: '**', redirectTo: '' }
];
