import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartService = inject(CartService);

    removeItem(id: number) {
        this.cartService.removeFromCart(id);
    }

    updateQuantity(id: number, event: Event) {
        const input = event.target as HTMLInputElement;
        const quantity = parseInt(input.value, 10);
        this.cartService.updateQuantity(id, quantity);
    }
}
