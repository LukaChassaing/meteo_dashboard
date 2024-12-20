import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoService } from '../../services/meteo.service';
import { LocationStats, Measurement } from '../../models/measurement.model';
import { Period } from '../../models/period.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faTree, 
  faThermometerHalf, 
  faDroplet,
  faArrowDown,
  faArrowUp,
  faStar
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="dashboard">
      <div *ngFor="let stat of stats" class="stat-card">
        <div class="location-header">
          <fa-icon 
            [icon]="stat.location === 'interior' ? homeIcon : treeIcon"
            class="location-icon">
          </fa-icon>
          <h2>{{ translateLocation(stat.location) }}</h2>
        </div>
        <div class="current-values">
          <div class="value-box">
            <span class="label">
              <fa-icon [icon]="thermometerIcon" class="icon temperature"></fa-icon>
              Température
            </span>
            <div class="value-with-badge">
              <span class="value">{{ formatTemperature(stat.current.temperature) }}°C</span>
              <span 
                class="badge"
                [class.hot]="stat.current.temperature >= 23"
                [class.warm]="stat.current.temperature >= 20 && stat.current.temperature < 23"
                [class.cool]="stat.current.temperature < 17"
              >
                {{ getTemperatureLabel(stat.current.temperature) }}
              </span>
            </div>
          </div>
          <div class="value-box">
            <span class="label">
              <fa-icon [icon]="dropletIcon" class="icon humidity"></fa-icon>
              Humidité
            </span>
            <div class="value-with-badge">
              <span class="value">{{ formatHumidity(stat.current.humidity) }}%</span>
              <span 
                class="badge"
                [class.high]="stat.current.humidity >= 70"
                [class.low]="stat.current.humidity < 40"
                [class.optimal]="stat.current.humidity >= 40 && stat.current.humidity <= 60"
              >
                {{ getHumidityLabel(stat.current.humidity) }}
              </span>
            </div>
          </div>
        </div>
        <div class="daily-stats">
          <h3>Statistiques sur {{ getPeriodLabel() }}</h3>
          <div class="stat-row">
            <span>
              <fa-icon [icon]="arrowDownIcon" class="icon min"></fa-icon>
              Température min :
            </span>
            <div class="value-with-indicator">
              <span>{{ formatTemperature(stat.daily.min_temperature) }}°C</span>
              <span class="indicator min" *ngIf="isMinTemperature(stat.daily.min_temperature, stat)">
                <fa-icon [icon]="starIcon"></fa-icon>
              </span>
            </div>
          </div>
          <div class="stat-row">
            <span>
              <fa-icon [icon]="arrowUpIcon" class="icon max"></fa-icon>
              Température max :
            </span>
            <div class="value-with-indicator">
              <span>{{ formatTemperature(stat.daily.max_temperature) }}°C</span>
              <span class="indicator max" *ngIf="isMaxTemperature(stat.daily.max_temperature, stat)">
                <fa-icon [icon]="starIcon"></fa-icon>
              </span>
            </div>
          </div>
          <div class="stat-row">
            <span>
              <fa-icon [icon]="thermometerIcon" class="icon"></fa-icon>
              Température moyenne :
            </span>
            <span>{{ formatTemperature(stat.daily.average.temperature) }}°C</span>
          </div>
          <div class="stat-row">
            <span>
              <fa-icon [icon]="dropletIcon" class="icon"></fa-icon>
              Humidité moyenne :
            </span>
            <span>{{ formatHumidity(stat.daily.average.humidity) }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .location-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    .location-icon {
      color: #2c3e50;
    }
    .current-values {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
    .value-box {
      text-align: center;
    }
    .label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.9em;
      color: #666;
      justify-content: center;
      margin-bottom: 5px;
    }
    .value {
      font-size: 1.8em;
      font-weight: bold;
      color: #2c3e50;
    }
    .daily-stats {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      color: #666;
      align-items: center;
    }
    .stat-row span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .value-with-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .badge {
      font-size: 0.7em;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge.hot {
      background-color: #ff6b6b;
      color: white;
    }
    .badge.warm {
      background-color: #ffd93d;
      color: #333;
    }
    .badge.cool {
      background-color: #4dabf7;
      color: white;
    }
    .badge.high {
      background-color: #4c6ef5;
      color: white;
    }
    .badge.low {
      background-color: #fab005;
      color: white;
    }
    .badge.optimal {
      background-color: #51cf66;
      color: white;
    }
    .value-with-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .indicator {
      font-size: 0.8em;
      &.min {
        color: #4dabf7;
      }
      &.max {
        color: #ff6b6b;
      }
    }
  `]
})
export class StatsDashboardComponent implements OnInit, OnChanges {
  // Icons
  homeIcon = faHome;
  treeIcon = faTree;
  thermometerIcon = faThermometerHalf;
  dropletIcon = faDroplet;
  arrowDownIcon = faArrowDown;
  arrowUpIcon = faArrowUp;
  starIcon = faStar;
   
  @Input() period: Period = '24h';
  stats: LocationStats[] = [];

  constructor(private meteoService: MeteoService) {}

  ngOnInit() {
    this.loadStats();
  }

  ngOnChanges() {
    this.loadStats();
  }

  getPeriodLabel(): string {
    switch (this.period) {
      case '24h': return 'les dernières 24 heures';
      case '7d': return 'les 7 derniers jours';
      case '30d': return 'les 30 derniers jours';
      case 'all': return 'toute la période';
      default: return 'la période';
    }
  }

  loadStats() {
    this.meteoService.getMeasurements(this.period).subscribe(measurements => {
      // Grouper les mesures par location
      const locationGroups = measurements.reduce((groups, measurement) => {
        if (!groups[measurement.location]) {
          groups[measurement.location] = [];
        }
        groups[measurement.location].push(measurement);
        return groups;
      }, {} as { [key: string]: Measurement[] });

      // Calculer les stats pour chaque location
      this.stats = Object.entries(locationGroups).map(([location, locationMeasurements]) => {
        // Dernière mesure pour les valeurs actuelles
        const current = locationMeasurements[locationMeasurements.length - 1];

        // Calculer les moyennes
        const sum = locationMeasurements.reduce((acc, m) => ({
          temperature: acc.temperature + m.temperature,
          humidity: acc.humidity + m.humidity
        }), { temperature: 0, humidity: 0 });

        const count = locationMeasurements.length;
        const averages = {
          temperature: sum.temperature / count,
          humidity: sum.humidity / count
        };

        // Trouver min/max température
        const minTemp = Math.min(...locationMeasurements.map(m => m.temperature));
        const maxTemp = Math.max(...locationMeasurements.map(m => m.temperature));

        return {
          location,
          current: {
            temperature: current.temperature,
            humidity: current.humidity
          },
          daily: {
            average: averages,
            min_temperature: minTemp,
            max_temperature: maxTemp
          }
        };
      });
    });
  }

  formatTemperature(value: number): string {
    return Number(value).toFixed(1);
  }

  formatHumidity(value: number): string {
    return Math.round(value).toString();
  }

  getTemperatureLabel(temp: number): string {
    if (temp >= 23) return 'Chaud';
    if (temp >= 20) return 'Tiède';
    if (temp < 17) return 'Frais';
    return '';
  }

  getHumidityLabel(humidity: number): string {
    if (humidity >= 70) return 'Élevée';
    if (humidity < 40) return 'Basse';
    if (humidity >= 40 && humidity <= 60) return 'Optimale';
    return '';
  }

  isMinTemperature(temp: number, stat: any): boolean {
    return temp === stat.daily.min_temperature;
  }

  isMaxTemperature(temp: number, stat: any): boolean {
    return temp === stat.daily.max_temperature;
  }

  translateLocation(location: string): string {
    const translations: { [key: string]: string } = {
      'interior': 'Intérieur',
      'exterior': 'Extérieur'
    };
    return translations[location] || location;
  }
}