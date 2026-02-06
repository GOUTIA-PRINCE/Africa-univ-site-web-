import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
    cartService = inject(CartService);
    route = inject(ActivatedRoute);

    allProducts: Product[] = [
        { id: 1, name: 'Smartphone Pro X', price: 599, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 2, name: 'Laptop Ultra Slim', price: 1299, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 3, name: 'Casque Audio Sans Fil', price: 199, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 4, name: 'Smartwatch Series 5', price: 249, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 5, name: 'Tablette Graphique', price: 349, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 6, name: 'Caméra 4K Action', price: 299, image: 'https://placehold.co/300x300', category: 'Électronique' },
        { id: 7, name: 'T-Shirt Coton Bio', price: 29, image: 'https://placehold.co/300x300', category: 'Vêtements' },
        { id: 8, name: 'Jean Slim Fit', price: 49, image: 'https://placehold.co/300x300', category: 'Vêtements' },
        { id: 9, name: 'Lampe de Bureau', price: 39, image: 'https://placehold.co/300x300', category: 'Maison' }
    ];

    filteredProducts: Product[] = [];

    // Filter states
    searchTerm: string = '';
    categories: string[] = ['Électronique', 'Vêtements', 'Maison'];
    selectedCategories: { [key: string]: boolean } = {
        'Électronique': false,
        'Vêtements': false,
        'Maison': false
    };
    maxPrice: number = 2000;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['search']) {
                this.searchTerm = params['search'];
            }
            this.applyFilters();
        });
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            // Filter by search term
            const matchesSearch = !this.searchTerm ||
                product.name.toLowerCase().includes(this.searchTerm.toLowerCase());

            // Filter by category
            const hasSelectedCategories = Object.values(this.selectedCategories).some(val => val);
            const matchesCategory = !hasSelectedCategories ||
                (product.category && this.selectedCategories[product.category]);

            // Filter by price
            const matchesPrice = product.price <= this.maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }

    onCategoryChange() {
        this.applyFilters();
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
