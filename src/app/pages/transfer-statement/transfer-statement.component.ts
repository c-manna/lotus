import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {
  filterForm: FormGroup;
  options = [{ name: "volvo" }, { name: "saab" }, { name: "mercedes" }, { name: "audi" }]
  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createFilterForm();
  }

  createFilterForm() {
    this.filterForm = this._fb.group({
      startDate: [""],
      endDate: [""],
      option: [""]
    });
  }

  formSubmit() {
    console.log("formSubmit==", this.filterForm.value)
  }

}
