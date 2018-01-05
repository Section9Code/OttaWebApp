import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticksToDate'
})
export class TicksToDatePipe implements PipeTransform {

  transform(value: number, args?: any): any {

    //ticks are in nanotime; convert to microtime
    var ticksToMicrotime = value / 10000;

    //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
    var epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));
    
    //new date is ticks, converted to microtime, minus difference from epoch microtime
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    tickDate.setHours(tickDate.getHours() - 1);

    return tickDate;
  }

}
