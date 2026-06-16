import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionDay } from '../../services/habits';

interface GridCell {
  date: string;
  count: number;
  level: number; // 0-4 para la intensidad del color
}

@Component({
  selector: 'app-contribution-graph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container">
      <div class="months-row">
        @for (month of monthLabels; track $index) {
          <span class="month-label" [style.margin-left.px]="month.offset">
            {{ month.label }}
          </span>
        }
      </div>
      <div class="grid">
        @for (week of weeks; track $index) {
          <div class="week">
            @for (cell of week; track cell.date) {
              <div
                class="cell"
                [class]="'level-' + cell.level"
                [style.background]="getCellColor(cell.level)"
                [title]="cell.date + ': ' + cell.count + ' completions'">
              </div>
            }
          </div>
        }
      </div>
      <div class="legend">
        <span>Menos</span>
        @for (l of [0,1,2,3,4]; track l) {
          <div class="cell" [style.background]="getCellColor(l)"></div>
        }
        <span>Más</span>
      </div>
    </div>
  `,
  styles: [`
    .month-label { font-size: 11px; color: #666; position: absolute; }
    .graph-container { padding: 0.5rem 0; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .months-row { display: flex; margin-bottom: 4px; padding-left: 0; min-width: max-content; }
    .grid { display: flex; gap: 3px; position: relative; margin-top: 20px; min-width: max-content; }
    .week { display: flex; flex-direction: column; gap: 3px; }
    .cell { width: 12px; height: 12px; border-radius: 2px; background: #1a1a2e; cursor: pointer; transition: transform 0.1s; }
    .cell:hover { transform: scale(1.3); }
    .legend { display: flex; align-items: center; gap: 4px; margin-top: 8px; }
    .legend span { font-size: 11px; color: #666; }
    .legend .cell { width: 12px; height: 12px; }
  `]
})
export class ContributionGraph implements OnChanges {
  @Input() contributions: ContributionDay[] = [];
  @Input() color: string = '#6366f1';

  weeks: GridCell[][] = [];
  monthLabels: { label: string; offset: number }[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contributions'] || changes['color']) {
      this.buildGrid();
    }
  }

  buildGrid() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);

    // Mapa de fecha -> count
    const countMap = new Map<string, number>();
    this.contributions.forEach(c => countMap.set(c.date, c.count));

    // Ir al domingo anterior al start
    while (start.getDay() !== 0) {
      start.setDate(start.getDate() - 1);
    }

    this.weeks = [];
    this.monthLabels = [];
    let lastMonth = -1;
    let weekIndex = 0;

    const current = new Date(start);
    while (current <= today) {
      const week: GridCell[] = [];

      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split('T')[0];
        const count = countMap.get(dateStr) ?? 0;
        const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;

        week.push({ date: dateStr, count, level });

        // Label del mes
        if (current.getMonth() !== lastMonth && d === 0) {
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          this.monthLabels.push({
            label: months[current.getMonth()],
            offset: weekIndex * 15
          });
          lastMonth = current.getMonth();
        }

        current.setDate(current.getDate() + 1);
      }

      this.weeks.push(week);
      weekIndex++;
    }
  }

  getCellColor(level: number): string {
    if (level === 0) return '#1a1a2e';
    const hex = this.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const opacity = [0, 0.25, 0.5, 0.75, 1][level];
    return `rgba(${r},${g},${b},${opacity})`;
  }
}
