import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicksToDatePipe } from "app/components/common/pipes/ticks-to-date.pipe";
import { TimeAgoPipe } from "app/components/common/pipes/timeAgo.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TicksToDatePipe,
    TimeAgoPipe
    ],
  exports:[
    TicksToDatePipe,
    TimeAgoPipe
  ]
})
export class PipesModule { }
