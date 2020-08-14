import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService, SnakebarService } from '@app/shared/services/common.service';
import { APIService } from '@app/shared/services/api.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  passwordFormSubmit: boolean = false;
  // settingData: any = { oneClickBet: true, oneClickStake: 1500, stakes: 500, casinoStakes: 1000 };
  buttonProperty = {
    oneClick: false,
    casinoStake: false,
    stake: false
  };
  settingData: any = {};
  constructor(
    private _fb: FormBuilder,
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _apiService: APIService
  ) { }

  get f() {
    return this.passwordForm.controls;
  }

  ngOnInit(): void {
    this.ceatePasswordForm();
    this.getSettingData();
  }


  ceatePasswordForm() {
    this.passwordForm = this._fb.group({
      password: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    }, {
      validators: this.matchPassword("newPassword", "confirmPassword")
    });
  }

  matchPassword(controlName: string, matchingControlName: string) {
    return (thirdStepForm: FormGroup) => {
      const control = thirdStepForm.controls[controlName];
      const matchingControl = thirdStepForm.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  getSettingData() {
    this._loadingService.show();
    this._apiService.ApiCall({}, `${environment.apiUrl}setting`, 'get').subscribe(res => {
      this._loadingService.hide();
      if (res.success) {
        this.settingData = res.data;
      } else {
        this._loadingService.hide();
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

  passwordSubmit() {
    console.log("this.passwordForm==", this.passwordForm);
    this.passwordFormSubmit = true;
    if (this.passwordForm.invalid) return;
    //do the API call
    this._loadingService.show();
    this._apiService.ApiCall(this.passwordForm.value, `${environment.apiUrl}update-password`, 'post').subscribe(res => {
      this._loadingService.hide();
      if (res.success) {
        this.passwordFormSubmit = false;
        this.ceatePasswordForm();
        this._snakebarService.show("success", res.message);
      } else {
        this._loadingService.hide();
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

  upDateOneClickBetting() {
    console.log(this.settingData.one_click_betting, this.settingData.one_click_betting == 0)
    this.settingData.one_click_betting = ((this.settingData.one_click_betting == 1) ? "0" : "1");
    console.log("called", this.settingData.one_click_betting);
    this.updateSetting(this.settingData);
    // do api call for one click betting form submit
  }

  changeOneClickStake(data) {
    this.settingData.one_click_default = data;
    this.updateSetting(this.settingData);
  }

  changeCasinoStakes(data) {
    this.settingData.edit_casino_stakes_default = data;
    this.updateSetting(this.settingData);
  }

  changeStakes(data) {
    this.settingData.edit_stake_default = data;
    this.updateSetting(this.settingData);
  }

  editOneClickStake() {
    this.buttonProperty.oneClick = false;
    console.log(this.settingData.oneClickStake);
    this.updateSetting(this.settingData);
  }

  editStakes() {
    this.buttonProperty.stake = false;
    console.log(this.settingData.stakes);
    this.updateSetting(this.settingData);
  }

  editCasinoStakes() {
    this.buttonProperty.casinoStake = false;
    console.log(this.settingData.casinoStakes);
    this.updateSetting(this.settingData);
  }

  changeTime(data) {
    console.log(data);
    this.settingData.time_setting = data;
    console.log("this.settingData==", this.settingData);
    this.updateSetting(this.settingData);
  }

  updateSetting(data) {
    console.log("setting==", this.settingData);
    this._loadingService.show();
    this._apiService.ApiCall(data, `${environment.apiUrl}update-setting`, 'post').subscribe(res => {
      this._loadingService.hide();
      if (res.success) {
        this._snakebarService.show("success", res.message);
      } else {
        this._loadingService.hide();
        this._snakebarService.show("error", res.message);
      }
    }, err => {
      this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

}
