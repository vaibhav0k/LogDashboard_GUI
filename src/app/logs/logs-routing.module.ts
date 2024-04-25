import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsListComponent } from './components/logs-list/logs-list.component';
import { LogsDetailsComponent } from './components/logs-details/logs-details.component';
import { MsalGuard } from '@azure/msal-angular';
import { LogsGrpbydetailsComponent } from './components/logs-grpbydetails/logs-grpbydetails.component';

const logsRoutes: Routes = [
  {
   path: 'logs',
   component: LogsListComponent,
   canActivate: [MsalGuard]
  },
  {
    path: 'logs/:groupName/:index',
    component: LogsGrpbydetailsComponent,
    canActivate: [MsalGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(logsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LogsRoutingModule { }
