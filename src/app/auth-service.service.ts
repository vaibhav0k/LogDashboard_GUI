import { Inject, Injectable } from '@angular/core';
import { LoggedinUser } from './logs/models/loggedin-user';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PopupRequest } from '@azure/msal-browser';
import { LogsServiceService } from './logs/services/logs-service.service';
import { Router } from '@angular/router';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  displayName?: string,
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  jobTitle?: string,
  mobilePhone?: string
};

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  profile!: ProfileType;
  user: LoggedinUser = new LoggedinUser();

  constructor(private authService: MsalService,
    private http: HttpClient,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private _logservice: LogsServiceService, private _router:Router) { }

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe({
          next: (result) => {
            this.setLoginDisplay();
            this.http.get(GRAPH_ENDPOINT)
              .subscribe(profile => {
                this.profile = profile;

                this.user.displayName = this.profile.displayName;
                this.user.jobTitle = this.profile.jobTitle;
                this.user.mobileNo = this.profile.mobilePhone;
                this.user.userPrincipalName = this.profile.userPrincipalName;
                this.user.iD = 1;
                this.user.timestamp = new Date();
                this._logservice.postUserdetails(this.user).subscribe((response: any) => {
                  console.log('User details posted successfully:', response);
                }, (error: any) => {
                  console.error('Error posting user details:', error);
                });
              });
            this._router.navigate(['/logs']);
          },
          error: (error) => console.log(error)
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (result) => {
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
    }
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "http://localhost:4200"
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
