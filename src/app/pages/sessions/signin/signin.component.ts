import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { APIService } from '@shared/services';


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
    private _apiService: APIService
  ) { }

  ngOnInit() {
    this.userForm();
  }

  userForm() {
    this.loginForm = this._fb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  login() {
    console.log("data==", this.loginForm);
    const reqData = this.loginForm.value;
    // this._apiService.ApiCall(reqData, `${environment.apiUrl}signin`, 'post').subscribe(result => {
    //     if (result.success) {
    this.router.navigate(["dashboard"]);
    //     }
    //   }, err => {   }
    // );
  }

  ngOnDestroy() {

  }

}
