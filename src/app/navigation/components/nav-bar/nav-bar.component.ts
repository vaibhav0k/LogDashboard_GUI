import { AfterViewInit, Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { AppComponent } from '../../../app.component';
import { AuthServiceService } from '../../../auth-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  @ViewChild(AppComponent, { static: true }) appComponent!: AppComponent;

  constructor(private _router: Router, private translateService: TranslateService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService, private authService: MsalService, private viewContainerRef: ViewContainerRef,
    private _mauthService: AuthServiceService) {

  }


  isIframe = false;
  lang: string = '';
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void  {
    this.lang = localStorage.getItem('lang') || 'en';

    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
    // this._router.navigate(['/logs']);
  }

  login() {
    this.loginDisplay = this._mauthService.loginDisplay;
    this._mauthService.login();
    console.log("after")
    this._router.navigate(['/logs']);
  }
  logout() {
    this._mauthService.logout();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }


  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang', selectedLanguage);

    this.translateService.use(selectedLanguage);

  }
}
