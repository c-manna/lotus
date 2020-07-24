import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  passwordFormSubmit: boolean = false;
  settingData: any = { oneClickBet: true, oneClickStake: 1500, stakes: 500, casinoStakes: 1000 };
  constructor(
    private _fb: FormBuilder
  ) { }

  get f() {
    return this.passwordForm.controls;
  }

  ngOnInit(): void {
    this.ceatePasswordForm();
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

  passwordSubmit() {
    console.log("this.passwordForm==", this.passwordForm);
    this.passwordFormSubmit = true;
    if (this.passwordForm.invalid) return;
    //do the API call
  }

  upDateOneClickBetting() {
    console.log("called", this.settingData.oneClickBet);
    // do api call for one click betting form submit
  }

  changeOneClickStake(data) {
    this.settingData.oneClickStake = data;
  }

  changeCasinoStakes(data) {
    this.settingData.casinoStakes = data;
  }

  changeStakes(data) {
    this.settingData.stakes = data;
  }

  editOneClickStake() {
    console.log(this.settingData.oneClickStake);
  }

  editStakes() {
    console.log(this.settingData.stakes);
  }

  editCasinoStakes() {
    console.log(this.settingData.casinoStakes);
  }

}
