import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoService } from '../../services/meteo.service';
import { Measurement, LocationStats } from '../../models/measurement.model';
import { Period } from '../../models/period.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'app-location-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="chart-container">
            <h2>{{ title }}</h2>
            <div class="chart-info">
                <span class="data-count" *ngIf="dataCount">
                    {{ dataCount }} mesures sélectionnées sur {{ periodLabel }}
                </span>
            </div>
            <canvas [id]="chartId"></canvas>
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
            margin-bottom: 5px;
            color: #2c3e50;
        }
        .chart-info {
            margin-bottom: 10px;
            font-size: 0.9em;
            color: #666;
        }
        .data-count {
            font-style: italic;
        }
    `]
})
export class LocationChartComponent implements OnInit, OnDestroy {
    @Input() location?: string;
    @Input() chartId!: string;
    @Input() title!: string;
    @Input() set period(value: Period) {
        this._period = value;
        if (this.chart) {
            this.updateChart();
        }
    }

    private _period: Period = '24h';
    private chart?: Chart;
    private destroy$ = new Subject<void>();
    dataCount: number = 0;

    get periodLabel(): string {
        switch(this._period) {
            case '24h': return 'les dernières 24 heures';
            case '7d': return 'les 7 derniers jours';
            case '30d': return 'les 30 derniers jours';
            case 'all': return 'toute la période';
            default: return '';
        }
    }

    get temperatureScale() {
        return this.location === 'interior' 
            ? { suggestedMin: 10, suggestedMax: 40 }
            : { suggestedMin: -10, suggestedMax: 45 };
    }

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
        const dataObservable = this.location
            ? this.meteoService.getMeasurementsByLocation(this.location, this._period)
            : this.meteoService.getMeasurements(this._period);

        dataObservable.pipe(
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.dataCount = data.length;
            if (this.chart) {
                this.chart.destroy();
            }
            this.createChart(data);
        });
    }

    private createChart(data: Measurement[]) {
        const tempScale = this.temperatureScale;
        
        this.chart = new Chart(this.chartId, {
            type: 'line',
            data: {
                labels: data.map(m => new Date(m.timestamp).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })),
                datasets: [
                    {
                        label: 'Température (°C)',
                        data: data.map(m => m.temperature),
                        borderColor: this.location === 'interior' 
                            ? 'rgb(255, 99, 132)' 
                            : 'rgb(255, 159, 64)',
                        yAxisID: 'y-temp',
                        tension: 0.1,
                        borderWidth: 2
                    },
                    {
                        label: 'Humidité (%)',
                        data: data.map(m => m.humidity),
                        borderColor: this.location === 'interior'
                            ? 'rgb(54, 162, 235)'
                            : 'rgb(75, 192, 192)',
                        yAxisID: 'y-humidity',
                        tension: 0.1,
                        borderWidth: 2,
                        borderDash: [5, 5]
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
                        suggestedMin: tempScale.suggestedMin,
                        suggestedMax: tempScale.suggestedMax,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return Number(value).toFixed(1) + '°C';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Température (°C)'
                        },
                        grid: {
                            drawOnChartArea: true
                        }
                    },
                    'y-humidity': {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                return Number(value) + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Humidité (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            maxTicksLimit: 8,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                const label = context.dataset.label || '';
                                const value = Number(context.parsed.y);
                                if (label.includes('Température')) {
                                    return `${label}: ${value.toFixed(1)}°C`;
                                } else {
                                    return `${label}: ${Math.round(value)}%`;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}