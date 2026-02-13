import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private productService = inject(ProductService);
    featuredProducts: Product[] = [];

    ngOnInit() {
        this.productService.getProducts().subscribe(products => {
            this.featuredProducts = products.slice(0, 4);
        });
    }

    orderOnWhatsApp(product: Product) {
        const phoneNumber = '690363577';
        const message = `Bonjour, je viens de votre site pour ce produit populaire : ${product.name}.
Prix : ${product.price} FCFA`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/237${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    }
}
