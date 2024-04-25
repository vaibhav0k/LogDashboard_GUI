import { Component, Inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../../auth-service.service';
import { Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private broadcastService: MsalBroadcastService, private authService: MsalService, private http: HttpClient,
    private _mauthService: AuthServiceService, private _router: Router) {

  }

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {

    this.loginDisplay = this._mauthService.loginDisplay;
    console.log(this.loginDisplay);
    if (this.loginDisplay) {
      console.log("logs true");
      this._router.navigate(['/logs']);
    }
    else
      console.log("logs false");

    this.isIframe = window !== window.parent && !window.opener;

    //this.broadcastService.inProgress$
    //  .pipe(
    //    filter((status: InteractionStatus) => status === InteractionStatus.None),
    //    takeUntil(this._destroying$)
    //  )
    //  .subscribe(() => {
    //    this.setLoginDisplay();
    //  })
  }

  login() {
    this.loginDisplay = this._mauthService.loginDisplay;
    this._mauthService.login();
    this.loginDisplay = this._mauthService.loginDisplay;
    console.log(this.loginDisplay);
    // if (this.loginDisplay)
   // this._router.navigate(['/logs']);
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
