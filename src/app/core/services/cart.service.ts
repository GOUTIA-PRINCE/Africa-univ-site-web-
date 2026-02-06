import { Injectable, computed, signal } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // Using signals for modern Angular state management
    readonly cartItems = signal<CartItem[]>([]);

    readonly cartCount = computed(() =>
        this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );

    readonly cartTotal = computed(() =>
        this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
    );

    addToCart(product: Product) {
        this.cartItems.update(items => {
            const existingItem = items.find(item => item.id === product.id);
            if (existingItem) {
                return items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...items, { ...product, quantity: 1 }];
        });
    }

    removeFromCart(productId: number) {
        this.cartItems.update(items => items.filter(item => item.id !== productId));
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this.cartItems.update(items =>
            items.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    clearCart() {
        this.cartItems.set([]);
    }
}
