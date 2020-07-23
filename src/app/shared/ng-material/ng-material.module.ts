import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class NgMaterialModule { }
