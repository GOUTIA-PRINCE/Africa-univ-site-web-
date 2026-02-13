import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AdminService } from '../../core/services/admin.service';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
    private productService = inject(ProductService);
    private adminService = inject(AdminService);
    authService = inject(AuthService);

    products: Product[] = [];
    users: any[] = [];
    activeTab: 'products' | 'users' = 'products';
    showModal = false;
    showUserModal = false;
    isEditing = false;

    selectedFile: File | null = null;
    selectedFileName: string = '';
    imagePreview: string | null = null;

    // Form model for products
    currentProduct: Product = {
        id: 0,
        name: '',
        price: 0,
        description: '',
        image: '',
        category: 'Électronique'
    };

    // Form model for users
    newUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };

    ngOnInit() {
        this.loadProducts();
        this.loadUsers();
    }

    openAddUserModal() {
        this.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        this.selectedFile = null;
        this.selectedFileName = '';
        this.imagePreview = null;
        this.showUserModal = true;
    }

    saveUser() {
        this.adminService.addUser(this.newUser, this.selectedFile || undefined).subscribe({
            next: () => {
                this.loadUsers();
                this.showUserModal = false;
            },
            error: (err) => {
                alert(err.error?.message || 'Erreur lors de la création de l\'utilisateur');
            }
        });
    }

    loadProducts() {
        this.productService.getProducts().subscribe(products => {
            this.products = products;
        });
    }

    loadUsers() {
        this.adminService.getUsers().subscribe(users => {
            this.users = users;
        });
    }

    toggleUserRole(user: any) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (confirm(`Voulez-vous vraiment passer ${user.firstName} au rôle ${newRole} ?`)) {
            this.adminService.updateUserRole(user.id, newRole).subscribe(() => {
                this.loadUsers();
            });
        }
    }

    deleteUser(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.adminService.deleteUser(id).subscribe(() => {
                this.loadUsers();
            }, (error) => {
                alert(error.error?.message || 'Erreur lors de la suppression');
            });
        }
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
