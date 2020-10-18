import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective } from './directive/numbers-only.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AppPasswordDirective } from './directive/app-password.directive';
import { TwoDigitDecimaNumberDirective, } from './directive/decimal-precision.directive';
import { HighlightDirective } from './directive/blink.directive';
const pipes = [
    TruncatePipe
]
const directives = [
  NumberDirective,
  AppPasswordDirective,
  TwoDigitDecimaNumberDirective,
  HighlightDirective
]

@NgModule({
  imports: [
  CommonModule,
  ],
  declarations: [directives,pipes],
  entryComponents: [],
  exports: [directives,pipes]
})
export class SharedCoreModule {}