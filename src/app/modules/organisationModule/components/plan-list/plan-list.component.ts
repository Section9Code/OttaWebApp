import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {
  @Input() currentPlanId = '';
  @Input() showCancel = true;

  @Output() planChanged = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  plans = environment.plans;

  constructor() { }

  ngOnInit() {
  }

  selectPlan(planId: string) {
    this.planChanged.emit(planId);
  }

  cancel() {
    this.cancelled.emit();
  }

}
