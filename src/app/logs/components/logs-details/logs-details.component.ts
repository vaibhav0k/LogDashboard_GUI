import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logs-details',
  templateUrl: './logs-details.component.html',
  styleUrl: './logs-details.component.css'
})
export class LogsDetailsComponent {

  @Input() selectedLog: any;
  @Input() showTable: any;
  selectedStackTrace: string = '';
  selectedlogforst: any;
  showStackTrace(stackTrace: string) {
    this.selectedStackTrace = stackTrace;
    console.log(this.selectedStackTrace);
  }
}
