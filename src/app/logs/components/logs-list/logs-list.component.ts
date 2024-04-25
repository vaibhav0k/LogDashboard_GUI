import { Component, Inject, ViewChild } from '@angular/core';
import { LogGroupCount } from '../../models/log-groupcount';
import { of } from 'rxjs';

import { LogsServiceService } from '../../services/logs-service.service';
import { LogException } from '../../models/log-exception';
import { TranslateService } from '@ngx-translate/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../../auth-service.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'logs-list',
  templateUrl: './logs-list.component.html',
  styleUrl: './logs-list.component.css'
})

export class LogsListComponent {

  @ViewChild(AppComponent, { static: true }) appComponent!: AppComponent;

  constructor(private _logservice: LogsServiceService, private translateService: TranslateService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService, private authService: MsalService, private http: HttpClient,
    private _mauthService: AuthServiceService, private router: Router, /*private _grpbydetcomp: LogsGrpbydetailsComponent*/) {

  }

  ngOnInit(): void {
    this.filteredAllLogs = this.logs;

  }
  
  grpname: string = '';
  index: number = -1;
  showsecondfilter: boolean = false;
  showTable: boolean = false;
  showTable2: boolean = false;
  showalllogs: boolean = false;
  showfilterlogs: boolean = false;
  isExpand: boolean = false;
  selectedLog: any;
  selectedgrp: any;
  selectedlogforst: any;
  searchEventcharacters: string = '';
  searchEventcharactersTable: string = '';


  selectedoption: string = 'applicationname';
  selectedoptioninfo: LogGroupCount[] = [];
  selectedoptioninfoinui: LogGroupCount[] = [];

  arrayData: LogException[] = [];
  logs: LogException[] = [];
  filterlogs: LogException[] = [];
  filteredAllLogs: LogException[] = [];
  filteredGrpLogs: LogException[] = [];
  cardColors: string[] = [];
  emptytest: LogException[] = [];
  displayedLogs: LogException[] = [];
  filters: { property: string, value: string }[] = [];

  val: string = "";
  filterStack: any[] = [];
  get filterStackArray() {
    return of(this.filterStack);
  }
  selectedCardIndex: number = -1; 

  generateRandomColors(data: any[]) {
    if (!this.cardColors || this.cardColors.length !== data.length) {
      this.cardColors = [];
      for (let i = 0; i < data.length; i++) {
        this.cardColors.push(this.getRandomLightColor());
      }
    }
  }

  getRandomLightColor(): string {
    const hue = Math.floor(Math.random() * 360); 
    const saturation = Math.floor(Math.random() * 30) + 70; 
    const lightness = Math.floor(Math.random() * 20) + 70; 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  toggleTable(log: any) {
    if (this.selectedLog === log) {
      this.showTable = !this.showTable;
      this.selectedLog = null;
    } else {
      this.showTable = true;
      this.selectedLog = log;
    }
  }

  togglefilter(prop: any, index: number)
  {
    console.log("Button Pressed");
    this.grpname = prop.groupName;
    this.index = index;
    console.log("In logslist: "+this.grpname+" "+this.index);

    this.changePageNumber();
    if (this.selectedCardIndex === index) {
      this.selectedCardIndex = -1;
      this.showTable2 = !this.showTable2;
      this.showsecondfilter = !this.showsecondfilter;
      console.log(this.filterStack);
      this.selectedgrp = null;
    } else {
      this.selectedgrp = prop;
      this.showsecondfilter = true;
      this.selectedCardIndex = index;
      this._logservice.getDataWithArrayParameter(this.selectedoption, prop.groupName, this.emptytest).subscribe({
        next: (data) => {
          this.filterlogs = data;
          while (this.filterStack.length > 0) {
            this.filterStack.pop();
          }
          while (this.filters.length > 0) {
            this.filters.pop();
          }
          console.log("Initial, filterStack:");
          this.filterStack.push(data);
          console.log("In logslist:");
          console.log(this.filterStack);
          this.showTable2 = true;
        },
        error: err => console.log(err)
      });
    }
  }

  displaySelectedValue(event: Event): void {
    this.searchEventcharacters = ''
    var value = (event.target as HTMLSelectElement).value;
    this.selectedoption = (event.target as HTMLSelectElement).value;

    if (value == 'allexceptions') {
      this._logservice.getAllLogs().subscribe({
        next: (data) => {
          this.logs = data;
          this.generateRandomColors(this.logs);
        },
        error: err => console.log(err)
      });
      this.showalllogs = true;
      this.showfilterlogs = false;
      this.showTable2 = false;
      this.showsecondfilter = false;
    }
    else if (value == 'select') {
      this.showsecondfilter = false;
      this.showalllogs = false;
      this.showfilterlogs = false;
      this.showTable = false;
      this.showTable2 = false;
    }
    else {
      this._logservice.getgrpbyall(value).subscribe({
        next: (data) => {
          this.selectedoptioninfo = data;
          this.generateRandomColors(this.selectedoptioninfo);
        },
        error: err => console.log(err)
      });
      this.showfilterlogs = true;
      this.showalllogs = false;
      this.showTable = false;
      this.showTable2 = false;
      this.showsecondfilter = false;
      this.isExpand = false;
    }
  }

  totalItemsPerPage: number = 5;
  CurrentPage: number = 1;
  changePageNumber(): void {
    this.CurrentPage = 1;
  }

  filterLogsBySearchTerm() {

    //this.displayedLogs = this.logs.slice(0, this.selectedLogCount);
    if (this.searchEventcharacters.trim() === '') {
      // If search field is empty, show all logs
      this.filteredAllLogs = this.logs;
    } else {
      // Filter logs based on search term
      this.filteredAllLogs = this.logs.filter(log =>
        log.message.toLowerCase().includes(this.searchEventcharacters.toLowerCase()) ||
        log.source.toLowerCase().includes(this.searchEventcharacters.toLowerCase())
      );
    }
    if (this.selectedLogCount == 0) this.selectedLogCount = this.logs.length
    return this.filteredAllLogs.slice(0, this.selectedLogCount)
  }

  filterGroupByTerm() {

    if (this.searchEventcharacters.trim() === '') {
      this.selectedoptioninfoinui = this.selectedoptioninfo;
    } else {
      this.selectedoptioninfoinui = this.selectedoptioninfo.filter(selectedoptioninfoElement =>
        selectedoptioninfoElement.groupName.toLowerCase().includes(this.searchEventcharacters.toLowerCase())
      );
    }
    return this.selectedoptioninfoinui
  }

  selectedLogCount: number = 10;

  showSelectedLogs() {
    this.displayedLogs = this.logs.slice(0, this.selectedLogCount);
  }

  showAllLogs() {
    this.selectedLogCount = this.logs.length;
    
  }
}
