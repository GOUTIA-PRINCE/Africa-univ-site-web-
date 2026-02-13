import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/products';
    private baseUrl = 'http://localhost:3000/';

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            map(products => products.map(p => this.formatProductImage(p)))
        );
    }

    getProductById(id: number): Observable<Product | undefined> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            map(product => product ? this.formatProductImage(product) : undefined)
        );
    }

    private formatProductImage(product: Product): Product {
        if (product.image && product.image.startsWith('assets/')) {
            return { ...product, image: this.baseUrl + product.image };
        }
        return product;
    }

    addProduct(product: Product, imageFile: File): Observable<Product> {
        const formData = new FormData();
        formData.append('product', JSON.stringify(product));
        formData.append('image', imageFile);
        return this.http.post<Product>(this.apiUrl, formData);
    }

    updateProduct(product: Product, imageFile?: File): Observable<Product> {
        const formData = new FormData();
        formData.append('product', JSON.stringify(product));
        if (imageFile) {
            formData.append('image', imageFile);
        }
        return this.http.put<Product>(`${this.apiUrl}/${product.id}`, formData);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
