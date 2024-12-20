import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoService } from '../../services/meteo.service';
import { Chart } from 'chart.js';
import { Period } from '../../models/period.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Measurement } from '../../models/measurement.model';

@Component({
  selector: 'app-combined-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h2>Comparaison Intérieur/Extérieur</h2>
      <canvas id="combinedChart"></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      margin: 20px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      margin-bottom: 15px;
      color: #2c3e50;
    }
  `]
})
export class CombinedChartComponent implements OnInit, OnDestroy {
  @Input() period: Period = '24h';
  private chart?: Chart;
  private destroy$ = new Subject<void>();

  constructor(private meteoService: MeteoService) {}

  ngOnInit() {
    this.updateChart();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private updateChart() {
    this.meteoService.getMeasurements(this.period).pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      const sortedData = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Séparer les données par location
      const interiorData = sortedData.filter(m => m.location === 'interior');
      const exteriorData = sortedData.filter(m => m.location === 'exterior');

      // Créer des timestamps uniformes basés sur toutes les données
      const allTimestamps = [...new Set([
        ...interiorData.map(m => new Date(m.timestamp).getTime()),
        ...exteriorData.map(m => new Date(m.timestamp).getTime())
      ])].sort();

      // Préparer les données pour le graphique
      const chartData = allTimestamps.map(timestamp => {
        const interior = interiorData.find(m => new Date(m.timestamp).getTime() === timestamp);
        const exterior = exteriorData.find(m => new Date(m.timestamp).getTime() === timestamp);
        return {
          timestamp,
          tempInt: interior?.temperature || null,
          tempExt: exterior?.temperature || null,
          humInt: interior?.humidity || null,
          humExt: exterior?.humidity || null
        };
      });

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart('combinedChart', {
        type: 'line',
        data: {
          labels: chartData.map(d => 
            new Date(d.timestamp).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
          ),
          datasets: [
            {
              label: 'Température Intérieure',
              data: chartData.map(d => d.tempInt),
              borderColor: 'rgb(255, 99, 132)',
              yAxisID: 'y-temp',
              tension: 0.1,
              borderWidth: 2,
              spanGaps: true
            },
            {
              label: 'Température Extérieure',
              data: chartData.map(d => d.tempExt),
              borderColor: 'rgb(255, 159, 64)',
              yAxisID: 'y-temp',
              tension: 0.1,
              borderWidth: 2,
              spanGaps: true
            },
            {
              label: 'Humidité Intérieure',
              data: chartData.map(d => d.humInt),
              borderColor: 'rgb(54, 162, 235)',
              yAxisID: 'y-humidity',
              tension: 0.1,
              borderWidth: 2,
              borderDash: [5, 5],
              spanGaps: true
            },
            {
              label: 'Humidité Extérieure',
              data: chartData.map(d => d.humExt),
              borderColor: 'rgb(75, 192, 192)',
              yAxisID: 'y-humidity',
              tension: 0.1,
              borderWidth: 2,
              borderDash: [5, 5],
              spanGaps: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            'y-temp': {
              type: 'linear',
              position: 'left',
              suggestedMin: -10,
              suggestedMax: 45,
              title: {
                display: true,
                text: 'Température (°C)'
              },
              ticks: {
                callback: function(value) {
                  return Number(value).toFixed(1) + '°C';
                }
              }
            },
            'y-humidity': {
              type: 'linear',
              position: 'right',
              suggestedMin: 0,
              suggestedMax: 100,
              title: {
                display: true,
                text: 'Humidité (%)'
              },
              ticks: {
                callback: function(value) {
                  return Number(value).toFixed(0) + '%';
                }
              },
              grid: {
                drawOnChartArea: false,
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                maxTicksLimit: 12
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  if (label.includes('Température')) {
                    return `${label}: ${context.parsed.y.toFixed(1)}°C`;
                  } else {
                    return `${label}: ${context.parsed.y.toFixed(0)}%`;
                  }
                }
              }
            }
          }
        }
      });
    });
  }
}