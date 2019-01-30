import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from 'services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'stripe-button',
    templateUrl: 'stripe-button.component.html',
    styleUrls: ['stripe-button.component.scss']
})
export class StripeButtonComponent implements OnInit {
    @Input() currency = 'GBP';
    @Input() heading = 'Otta';
    @Input() description = 'Description';
    @Input() amount = 0;
    @Input() buttonText = 'Checkout';
    @Output() onPayment = new EventEmitter<string>();

    isPaying = false;

    constructor(private auth: AuthService) {
    }

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
            email: this.auth.userProfile.email,
            description: this.description,
            currency: this.currency,
            amount: this.amount,
            image: 'https://app.otta.io/assets/images/logo/logosquare.png',
            closed: () => this.isPaying = false
        });
    }
}
