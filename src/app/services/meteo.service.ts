import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Measurement, LocationStats } from '../models/measurement.model';
import { Period } from '../models/period.model';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private apiUrl = 'http://<meteo_api_server_address>:<meteo_api_server_port>';

  constructor(private http: HttpClient) {}

  private getMaxDataPoints(period: Period): number {
    switch (period) {
      case '24h': return 144; // Un point toutes les 10 minutes
      case '7d': return 168;  // Un point par heure
      case '30d': return 360; // Un point toutes les 2 heures
      case 'all': return 720; // Plus de points pour la vue complète
      default: return 144;
    }
  }

  private filterDataByPeriod<T extends { timestamp: string }>(data: T[], period: Period): T[] {
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    if (period === 'all') {
      return sortedData;
    }

    const now = new Date();
    const periodInHours = {
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const cutoffTime = new Date(now.getTime() - periodInHours[period] * 60 * 60 * 1000);
    return sortedData.filter(item => new Date(item.timestamp) > cutoffTime);
  }

  private sampleData<T extends Measurement>(data: T[], period: Period): T[] {
    const maxDataPoints = this.getMaxDataPoints(period);
    if (data.length <= maxDataPoints) return data;

    const result: T[] = [];
    const bucketSize = Math.floor(data.length / maxDataPoints);

    // Toujours garder le premier point
    result.push(data[0]);

    // Échantillonnage adaptatif basé sur la période
    for (let i = 0; i < data.length - 1; i += bucketSize) {
      const bucket = data.slice(i, Math.min(i + bucketSize, data.length));
      
      if (bucket.length > 0) {
        // Trouver les points significatifs dans chaque bucket
        const maxTemp = bucket.reduce((max, curr) => 
          curr.temperature > max.temperature ? curr : max, bucket[0]);
        const minTemp = bucket.reduce((min, curr) => 
          curr.temperature < min.temperature ? curr : min, bucket[0]);
        
        // Pour les périodes courtes, on garde plus de détails
        if (period === '24h') {
          if (minTemp !== maxTemp) {
            result.push(minTemp);
            result.push(maxTemp);
          } else {
            result.push(bucket[Math.floor(bucket.length / 2)]);
          }
        } else {
          // Pour les périodes plus longues, on calcule une moyenne
          const avgTemp = bucket.reduce((sum, curr) => sum + curr.temperature, 0) / bucket.length;
          const avgHum = bucket.reduce((sum, curr) => sum + curr.humidity, 0) / bucket.length;
          
          // Trouver le point le plus proche de la moyenne
          const closest = bucket.reduce((prev, curr) => 
            Math.abs(curr.temperature - avgTemp) < Math.abs(prev.temperature - avgTemp) ? curr : prev
          );
          
          result.push(closest);
        }
      }
    }

    // Toujours garder le dernier point
    const lastPoint = data[data.length - 1];
    if (result[result.length - 1] !== lastPoint) {
      result.push(lastPoint);
    }

    return result.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  getMeasurements(period: Period = '24h'): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/measurements`).pipe(
      map(data => {
        const filteredData = this.filterDataByPeriod(data, period);
        return this.sampleData(filteredData, period);
      })
    );
  }

  getMeasurementsByLocation(location: string, period: Period = '24h'): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/measurements/${location}`).pipe(
      map(data => {
        const filteredData = this.filterDataByPeriod(data, period);
        return this.sampleData(filteredData, period);
      })
    );
  }

  getStats(period: Period = '24h'): Observable<LocationStats[]> {
    return this.getMeasurements(period).pipe(
      map(measurements => {
        const locationGroups = measurements.reduce((groups, measurement) => {
          if (!groups[measurement.location]) {
            groups[measurement.location] = [];
          }
          groups[measurement.location].push(measurement);
          return groups;
        }, {} as { [key: string]: Measurement[] });

        return Object.entries(locationGroups).map(([location, locationMeasurements]) => {
          const sortedMeasurements = locationMeasurements.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          const current = sortedMeasurements[0];
          const sum = locationMeasurements.reduce((acc, m) => ({
            temperature: acc.temperature + m.temperature,
            humidity: acc.humidity + m.humidity
          }), { temperature: 0, humidity: 0 });

          const count = locationMeasurements.length;
          const averages = {
            temperature: sum.temperature / count,
            humidity: sum.humidity / count
          };

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
      })
    );
  }
}