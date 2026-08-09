import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true // Use true if you're on Angular 14+
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || isNaN(value)) return '00:00:00';

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    // Pad with leading zeros to ensure 2-digit format
    const hDisplay = hours.toString().padStart(2, '0');
    const mDisplay = minutes.toString().padStart(2, '0');
    const sDisplay = seconds.toString().padStart(2, '0');

    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
}