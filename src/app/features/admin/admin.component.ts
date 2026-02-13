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

    selectedFile: File | null = null;
    selectedFileName: string = '';
    imagePreview: string | null = null;

    // Form model
    currentProduct: Product = {
        id: 0,
        name: '',
        price: 0,
        description: '',
        image: '',
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

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.selectedFileName = file.name;

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    openAddModal() {
        this.isEditing = false;
        this.selectedFile = null;
        this.selectedFileName = '';
        this.imagePreview = null;
        this.currentProduct = {
            id: 0,
            name: '',
            price: 0,
            description: '',
            image: '',
            category: 'Électronique'
        };
        this.showModal = true;
    }

    openEditModal(product: Product) {
        this.isEditing = true;
        this.selectedFile = null;
        this.selectedFileName = '';
        this.imagePreview = product.image;
        this.currentProduct = { ...product };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveProduct() {
        if (this.isEditing) {
            this.productService.updateProduct(this.currentProduct, this.selectedFile || undefined).subscribe(() => {
                this.loadProducts();
                this.closeModal();
            });
        } else {
            if (!this.selectedFile) {
                alert('Veuillez sélectionner une image');
                return;
            }
            this.productService.addProduct(this.currentProduct, this.selectedFile).subscribe(() => {
                this.loadProducts();
                this.closeModal();
            });
        }
    }

    deleteProduct(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.productService.deleteProduct(id).subscribe(() => {
                this.loadProducts();
            });
        }
    }
}
