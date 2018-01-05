import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    moduleId: module.id,
    selector: 'stripe-button',
    templateUrl: 'stripe-button.component.html',
    styleUrls: ['stripe-button.component.scss']
})
export class StripeButtonComponent implements OnInit{
    @Input() currency: string = 'GBP';
    @Input() heading: string = "Otta";
    @Input() description: string = "Description";
    @Input() amount: number = 0;
    @Input() buttonText: string = 'Checkout';

    @Output() onPayment = new EventEmitter<string>();

    isPaying:boolean = false;

    ngOnInit(): void {
    }
    
    checkout() {
        this.isPaying = true;
        var handler = (<any>window).StripeCheckout.configure({
            key: environment.stripeKey,
            locale: 'auto',
            token: response => {
                console.log('Card processed', response);
                this.isPaying = false;
                this.onPayment.emit(response.id);
            }
        });

        handler.open({
            name: this.heading,
            description: this.description,
            currency: this.currency,
            amount: this.amount,
            closed: () => this.isPaying = false
        });
    }
}
