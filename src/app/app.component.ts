import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationChartComponent } from './components/location-chart/location-chart.component';
import { CombinedChartComponent } from './components/combined-chart/combined-chart.component';
import { StatsDashboardComponent } from './components/stats-dashboard/stats-dashboard.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { Period } from './models/period.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      CommonModule,
      LocationChartComponent,
      PeriodSelectorComponent,
      StatsDashboardComponent,    
      CombinedChartComponent,     
  ],
  template: `
    <div class="app-container">
      <header>
        <div class="header-content">
          <h1>
            <span class="logo">🌡️</span>
            Météo Dashboard
          </h1>
          <div class="header-info">
            Dernière mise à jour : {{ getCurrentTime() }}
          </div>
        </div>
      </header>
      <main>
        <app-period-selector
          (periodChange)="onPeriodChange($event)"
          class="animate-fade-in">
        </app-period-selector>
        
        <app-stats-dashboard
          [period]="currentPeriod"
          class="animate-slide-up">
        </app-stats-dashboard>
        
        <div class="charts-grid animate-slide-up">
          <app-location-chart 
            location="interior" 
            chartId="interiorChart" 
            title="Mesures Intérieures"
            [period]="currentPeriod">
          </app-location-chart>
          
          <app-location-chart 
            location="exterior" 
            chartId="exteriorChart" 
            title="Mesures Extérieures"
            [period]="currentPeriod">
          </app-location-chart>
        </div>
        
        <app-combined-chart
          [period]="currentPeriod"
          class="animate-slide-up">
        </app-combined-chart>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
    }
    
    header {
      background: linear-gradient(to right, #1e293b, #334155);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 2rem;
      margin-right: 0.5rem;
      vertical-align: middle;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-info {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    .animate-slide-up {
      animation: slideUp 0.5s ease-out;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  currentPeriod: Period = '24h';

  getCurrentTime(): string {
    return new Date().toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  onPeriodChange(period: Period) {
    this.currentPeriod = period;
  }
}