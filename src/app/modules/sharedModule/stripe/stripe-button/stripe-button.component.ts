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
        console.log('Stripe button', this.amount);
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

        let emailAddress = '';
        if (this.auth.userProfile && this.auth.userProfile.email) {
            emailAddress = this.auth.userProfile.email;
        }

        handler.open({
            name: this.heading,
            email: emailAddress,
            description: this.description,
            currency: this.currency,
            amount: this.amount,
            image: 'https://app.otta.io/assets/images/logo/logosquare.png',
            closed: () => this.isPaying = false
        });
    }
}
