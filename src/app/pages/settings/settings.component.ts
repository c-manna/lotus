import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { APIService, LoadingService, SnakebarService, DataService, CommonService } from '@shared/services';
import { environment } from '@env/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  passwordFormSubmit: boolean = false;
  buttonProperty = {
    oneClick: false,
    casinoStake: false,
    stake: false
  };
  settingData: any = {};
  selectedTime: any = new Date();
  timeInterval: any;
  constructor(
    private _ds: DataService,
    private _fb: FormBuilder,
    private _snakebarService: SnakebarService,
    private _loadingService: LoadingService,
    private _apiService: APIService,
    private _commonService: CommonService
  ) {
    this.timeInterval = setInterval(() => {
      if (this.settingData && this.settingData.time_setting && this.settingData.time_setting == 1) {
        this.selectedTime = new Date(new Date().setHours(new Date().getHours() - 5)).setMinutes(new Date().getMinutes() - 30);
      } else {
        this.selectedTime = new Date();
      }
    }, 1000)
  }

  get f() {
    return this.passwordForm.controls;
  }

  ngOnInit(): void {
    this.ceatePasswordForm();
    this.getSettingData();
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
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
    this._ds.settingData$.subscribe(data => {
      this.settingData = data;
      if (this.settingData == null) {
        this._commonService.getSettingData();
      }
      //console.log(this.settingData)
    });
  }

  passwordSubmit() {
    //console.log("this.passwordForm==", this.passwordForm);
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
    this._loadingService.show();
    this._apiService.ApiCall(data, `${environment.apiUrl}update-setting`, 'post').subscribe(res => {
      this._loadingService.hide();
      if (res.success) {
        this._snakebarService.show("success", res.message);
      } else {
        this._loadingService.hide();
        this._snakebarService.show("error", res.message);
      }
      this._commonService.getSettingData();
    }, err => {
      this._loadingService.hide();
      this._snakebarService.show("error", err.message);
    });
  }

}
