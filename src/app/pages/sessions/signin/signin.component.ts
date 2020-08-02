import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';
import { LoadingService, SnakebarService } from '@app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private _apiService: APIService,
    private _loadingService: LoadingService,
    private _snakebarService: SnakebarService,
    private _cookieService: CookieService
  ) { }

  ngOnInit() {
    this.userForm();
  }

  userForm() {
    this.loginForm = this._fb.group({
      user: ["dynamic007", [Validators.required]],
      password: ["111111", [Validators.required]]
    });
  }

  login() {
    console.log("data==", this.loginForm);
    const reqData = this.loginForm.value;
    this._loadingService.show();
    this._apiService.ApiCall(reqData, `${environment.apiUrl}login`, 'post').subscribe(result => {
      this._loadingService.hide();
      if (result.success) {
        this._snakebarService.show("success", result.message);
        this._cookieService.set("token", JSON.stringify(result['token']));
        this._cookieService.set("user", JSON.stringify(result['data'][0]));
        this.router.navigate(["dashboard"]);
      } else {
        this._loadingService.hide();
        this._snakebarService.show("error", result.message);
      }
    }, err => {
      this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    }
    );
  }

  ngOnDestroy() {}

}
