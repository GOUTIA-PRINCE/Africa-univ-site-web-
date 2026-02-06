import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartItems = [
        { id: 1, name: 'Smartphone Pro X', price: 599, quantity: 1, image: 'https://placehold.co/100x100' }
    ];

    get total() {
        return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
}
