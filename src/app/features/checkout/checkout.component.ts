import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
    cartService = inject(CartService);
    fb = inject(FormBuilder);
    router = inject(Router);

    checkoutForm = this.fb.group({
        paymentMethod: ['card', Validators.required],
        shipping: this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            country: ['France', Validators.required]
        }),
        payment: this.fb.group({
            cardName: [''],
            cardNumber: [''],
            expiryDate: [''],
            cvv: [''],
            mobileNumber: ['']
        })
    });

    constructor() {
        this.setupPaymentValidation();
    }

    setupPaymentValidation() {
        const paymentGroup = this.checkoutForm.get('payment') as FormGroup;
        const paymentMethodControl = this.checkoutForm.get('paymentMethod');

        if (!paymentGroup || !paymentMethodControl) return;

        // Initial validation setup
        this.updateValidators(paymentMethodControl.value);

        // React to changes
        paymentMethodControl.valueChanges.subscribe(method => {
            this.updateValidators(method);
        });
    }

    updateValidators(method: string | null) {
        const paymentGroup = this.checkoutForm.get('payment') as FormGroup;
        if (!paymentGroup) return;

        // Clear all validators first
        Object.keys(paymentGroup.controls).forEach(key => {
            paymentGroup.get(key)?.clearValidators();
            paymentGroup.get(key)?.updateValueAndValidity({ emitEvent: false });
        });

        if (method === 'card') {
            paymentGroup.get('cardName')?.setValidators([Validators.required]);
            paymentGroup.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
            paymentGroup.get('expiryDate')?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]);
            paymentGroup.get('cvv')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3}$')]);
        } else if (method === 'mtn' || method === 'orange') {
            paymentGroup.get('mobileNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{9,10}$')]);
        }

        // Update validity of the group
        paymentGroup.updateValueAndValidity();
    }

    onSubmit() {
        if (this.checkoutForm.valid) {
            console.log('Order submitted', this.checkoutForm.value);
            // Simulate API call
            setTimeout(() => {
                this.cartService.clearCart();
                alert('Commande validée avec succès !');
                this.router.navigate(['/']);
            }, 1000);
        } else {
            this.checkoutForm.markAllAsTouched();
        }
    }
}
