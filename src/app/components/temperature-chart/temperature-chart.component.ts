import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoService } from '../../services/meteo.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-temperature-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas id="temperatureChart"></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 400px;
      margin: 20px;
    }
  `]
})
export class TemperatureChartComponent implements OnInit {
  constructor(private meteoService: MeteoService) {}

  ngOnInit() {
    this.meteoService.getMeasurements().subscribe(data => {
      const timestamps = data.map(m => new Date(m.timestamp).toLocaleString());
      const temperatures = data.map(m => m.temperature);

      new Chart('temperatureChart', {
        type: 'line',
        data: {
          labels: timestamps,
          datasets: [{
            label: 'Temperature (°C)',
            data: temperatures,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    });
  }
}