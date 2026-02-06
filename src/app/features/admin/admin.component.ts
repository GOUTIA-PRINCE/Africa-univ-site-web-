import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
    private productService = inject(ProductService);

    products: Product[] = [];
    showModal = false;
    isEditing = false;

    // Form model
    currentProduct: Product = {
        id: 0,
        name: '',
        price: 0,
        description: '',
        image: 'https://placehold.co/300x300',
        category: 'Électronique'
    };

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getProducts().subscribe(products => {
            this.products = products;
        });
    }

    openAddModal() {
        this.isEditing = false;
        this.currentProduct = {
            id: Math.max(...this.products.map(p => p.id)) + 1,
            name: '',
            price: 0,
            description: '',
            image: 'https://placehold.co/300x300',
            category: 'Électronique'
        };
        this.showModal = true;
    }

    openEditModal(product: Product) {
        this.isEditing = true;
        this.currentProduct = { ...product };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveProduct() {
        if (this.isEditing) {
            const index = this.products.findIndex(p => p.id === this.currentProduct.id);
            if (index !== -1) {
                this.products[index] = { ...this.currentProduct };
            }
        } else {
            this.products.push({ ...this.currentProduct });
        }
        this.closeModal();
        // Note: In a real app, we would call a service method to update the backend
    }

    deleteProduct(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.products = this.products.filter(p => p.id !== id);
        }
    }
}
