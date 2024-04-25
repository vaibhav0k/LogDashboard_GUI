import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogException } from '../../models/log-exception';
import saveAs from 'file-saver';
import { LogsServiceService } from '../../services/logs-service.service';

@Component({
  selector: 'app-logs-grpbydetails',
  templateUrl: './logs-grpbydetails.component.html',
  styleUrl: './logs-grpbydetails.component.css'
})
export class LogsGrpbydetailsComponent implements OnInit{

  constructor(private _activatedRoute: ActivatedRoute, private _logservice: LogsServiceService) {

   }

   @Input() grpname: string = '';
   @Input() index: Number = -1;
   @Input() selectedoption: any;
   @Input() filterlogs: any;
   @Input() logs: any;
   @Input() filterStack: any;
   @Input() showsecondfilter: any;
   @Input() showTable2: any;
   @Input() isExpand: any;
   @Input() filters: { property: string, value: string }[] = [];

   searchEventcharactersTable: string = '';
   displayedLogs: LogException[] = [];
   selectedlogforst: any;
   // filters: { property: string, value: string }[] = [];

  ngOnInit() {
    console.log("Child:-");
    console.log(this.grpname + " " + this.index);
    console.log(this.filterlogs);
    this.isExpand = false;
  }

  addFilter(selectedFilter: string, inputValue: string) {
    const inputElement = document.getElementById('inputValue') as HTMLInputElement;
    const errorSpan = document.querySelector('.hidden-span') as HTMLElement;

    if (inputElement && inputElement.value.trim() === '') {
      errorSpan.hidden = false; // Show the error message
    } else {
      errorSpan.hidden = true;
      this.filters.push({ property: selectedFilter, value: inputValue });
      this._logservice.getDataWithArrayParameter(selectedFilter, inputValue, this.filterlogs).subscribe({
        next: (data) => {
          this.changePageNumber();
          this.filterlogs = data;
          this.filterStack.push(data);
          console.log("After Adding, filterStack:");
          console.log(this.filterStack);
        //  this.showTable2 = true;
        //  this.showTable = false;
        },
        error: err => console.log(err)
      });
    }
  }

  removeFilter(index: number) {
    if (this.filterStack.length > 1) {
      this.filters.splice(index, 1);
      this.filterStack.pop();
      this.filterlogs = this.filterStack[this.filterStack.length - 1];
      console.log("After Removing, filterStack:");
      console.log(this.filterStack);
     // this.showTable = false;
    }
  }

  selectedStackTrace: string = '';

  showStackTrace(stackTrace: string) {
    this.selectedStackTrace = stackTrace;
  }

  totalItemsPerPage: number = 5;
  CurrentPage: number = 1;
  changePageNumber(): void {
    this.CurrentPage = 1;
  }

  validateInput(event: any): void {
    const value = event.target.value;
    if (value <= 0 || isNaN(value)) {
      this.totalItemsPerPage = 10; // Set a default value if input is invalid
    }
  }

  filterLogsByMessage(): LogException[] {
    return this.filterlogs.filter((log: { statusCode: { toString: () => any; }; severity: any; applicationName: any; message: any; source: any; }) =>
      [log.statusCode.toString(), log.severity, log.applicationName, log.message, log.source]
        .map((field) => field.toLocaleLowerCase())
        .some((field) =>
          field.includes(this.searchEventcharactersTable.toLocaleLowerCase())
        )
    );
  }

  downloadCSV(): void {
    const csvData = this.convertToCSV(this.filterlogs);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'logs.csv');
  }

  convertToCSV(logs: LogException[]): string {
    const headers = ['Id', 'Status Code', 'Message', 'Source', 'Severity', 'Application Name', 'Timestamp', 'Stack Trace'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    logs.forEach(log => {
      const row = [
        log.id,
        log.statusCode,
        log.message,
        log.source,
        log.severity,
        log.applicationName,
        log.timestamp,
        log.stackTrace
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  toggleCollapse() {
    const expandBtn = document.getElementById("expandBtn");
    if (expandBtn) {
      this.isExpand = !this.isExpand;
      // expandBtn.innerHTML = expandBtn.innerHTML === "Add Filter" ? "<i class='bi bi-caret-up-fill'></i>" : "Add Filter";
    }
  }

}
