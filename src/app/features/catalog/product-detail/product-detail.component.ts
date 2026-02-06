import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartService = inject(CartService);

    product: Product | undefined;

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.productService.getProductById(id).subscribe(product => {
            this.product = product;
        });
    }

    addToCart() {
        if (this.product) {
            this.cartService.addToCart(this.product);
        }
    }
}
