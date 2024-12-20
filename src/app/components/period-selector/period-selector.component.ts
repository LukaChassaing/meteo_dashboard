import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Period = '24h' | '7d' | '30d' | 'all';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="period-selector">
      <div class="selector-content">
        <div class="selector-label">Période</div>
        <div class="buttons-container">
          <button
            *ngFor="let p of periods"
            [class.active]="selectedPeriod === p.value"
            (click)="selectPeriod(p.value)"
            class="period-button"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .period-selector {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .selector-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .selector-label {
      font-weight: 600;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.875rem;
    }

    .buttons-container {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .period-button {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: transparent;
      color: #64748b;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 100px;
      position: relative;
      overflow: hidden;
    }

    .period-button:hover {
      background: #f8fafc;
      border-color: #94a3b8;
      color: #1e293b;
    }

    .period-button.active {
      background: #2c3e50;
      border-color: #2c3e50;
      color: white;
      font-weight: 600;
    }

    .period-button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #60a5fa;
    }

    @media (max-width: 640px) {
      .selector-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .buttons-container {
        grid-template-columns: repeat(2, 1fr);
      }

      .period-button {
        flex: 1;
        text-align: center;
      }
    }
  `]
})
export class PeriodSelectorComponent {
    @Output() periodChange = new EventEmitter<Period>();

    selectedPeriod: Period = '24h';

    periods = [
        { value: '24h' as Period, label: '24 heures' },
        { value: '7d' as Period, label: '7 jours' },
        { value: '30d' as Period, label: '30 jours' },
        { value: 'all' as Period, label: 'Tout' }
    ];

    selectPeriod(period: Period) {
        this.selectedPeriod = period;
        this.periodChange.emit(period);
    }
}