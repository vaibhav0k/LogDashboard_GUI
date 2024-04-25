import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedinUser } from '../../../logs/models/loggedin-user';
import { LogsServiceService } from '../../../logs/services/logs-service.service';
import { AuthServiceService } from '../../../auth-service.service';

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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profile!: ProfileType;

  constructor(private _logservice: LogsServiceService, private http: HttpClient, private _mauthService: AuthServiceService)
  { }

  ngOnInit() {
    this.getProfile();
    this._mauthService.loginDisplay = true;
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
  }
}
