import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
    cartService = inject(CartService);
    productService = inject(ProductService);
    route = inject(ActivatedRoute);

    allProducts: Product[] = [];
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
        this.productService.getProducts().subscribe(products => {
            this.allProducts = products;
            this.route.queryParams.subscribe(params => {
                if (params['search']) {
                    this.searchTerm = params['search'];
                }
                this.applyFilters();
            });
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
