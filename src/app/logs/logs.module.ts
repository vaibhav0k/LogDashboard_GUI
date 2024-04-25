import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsListComponent } from './components/logs-list/logs-list.component';
import { LogsServiceService } from './services/logs-service.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { LogsDetailsComponent } from './components/logs-details/logs-details.component';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsGrpbydetailsComponent } from './components/logs-grpbydetails/logs-grpbydetails.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LogsListComponent,
    LogsDetailsComponent,
    LogsGrpbydetailsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LogsRoutingModule
  ],
  providers: [
    LogsServiceService,
    HttpClient
  ],
  exports: [
    LogsListComponent
  ],
  bootstrap: [LogsListComponent]
})
export class LogsModule { }
