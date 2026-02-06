import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
    cartService = inject(CartService);

    products: Product[] = [
        { id: 1, name: 'Smartphone Pro X', price: 599, image: 'https://placehold.co/300x300' },
        { id: 2, name: 'Laptop Ultra Slim', price: 1299, image: 'https://placehold.co/300x300' },
        { id: 3, name: 'Casque Audio Sans Fil', price: 199, image: 'https://placehold.co/300x300' },
        { id: 4, name: 'Smartwatch Series 5', price: 249, image: 'https://placehold.co/300x300' },
        { id: 5, name: 'Tablette Graphique', price: 349, image: 'https://placehold.co/300x300' },
        { id: 6, name: 'Caméra 4K Action', price: 299, image: 'https://placehold.co/300x300' }
    ];

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
