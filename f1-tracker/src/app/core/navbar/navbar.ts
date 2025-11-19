import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container flex-row justify-between">
        <a routerLink="/" class="logo">F1 TRACKER</a>
        <ul class="nav-links flex-row gap-20">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li><a routerLink="/season-current" routerLinkActive="active">Current Season</a></li>
          <li><a routerLink="/season-next" routerLinkActive="active">Next Season</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--nav-bg);
      padding: 15px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid #333;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--text-primary);
    }
    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.3s;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--accent-color);
    }
    @media (max-width: 600px) {
      .navbar .container {
        flex-direction: column;
        gap: 10px;
      }
      .nav-links {
        font-size: 0.8rem;
      }
    }
  `]
})
export class NavbarComponent { }
