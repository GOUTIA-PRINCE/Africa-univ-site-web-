import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: Product[] = [
        { id: 1, name: 'Smartphone Pro X', price: 599, description: 'Le dernier smartphone avec un écran OLED de 6.7 pouces et une batterie longue durée.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 2, name: 'Laptop Ultra Slim', price: 1299, description: 'Un ordinateur portable ultra-léger avec processeur M2 et 16Go de RAM.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 3, name: 'Casque Audio Sans Fil', price: 199, description: 'Réduction de bruit active et son haute fidélité.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 4, name: 'Smartwatch Series 5', price: 249, description: 'Suivez votre santé et vos notifications au poignet.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 5, name: 'Tablette Graphique', price: 349, description: 'Parfaite pour les designers et illustrateurs.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 6, name: 'Caméra 4K Action', price: 299, description: 'Étanche et résistante aux chocs pour vos aventures.', image: 'https://placehold.co/600x400', category: 'Électronique' },
        { id: 7, name: 'T-Shirt Coton Bio', price: 29, description: 'Confortable et respectueux de l\'environnement.', image: 'https://placehold.co/600x400', category: 'Vêtements' },
        { id: 8, name: 'Jean Slim Fit', price: 49, description: 'Une coupe moderne et élégante pour toutes les occasions.', image: 'https://placehold.co/600x400', category: 'Vêtements' },
        { id: 9, name: 'Lampe de Bureau', price: 39, description: 'Design minimaliste avec éclairage LED ajustable.', image: 'https://placehold.co/600x400', category: 'Maison' }
    ];

    getProducts(): Observable<Product[]> {
        return of(this.products);
    }

    getProductById(id: number): Observable<Product | undefined> {
        return of(this.products.find(p => p.id === id));
    }
}
