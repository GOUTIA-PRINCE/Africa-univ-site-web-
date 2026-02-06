import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    cartService = inject(CartService);
    router = inject(Router);
    isSearchOpen = false;
    searchTerm = '';

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    onSearch() {
        if (this.searchTerm.trim()) {
            this.router.navigate(['/catalog'], { queryParams: { search: this.searchTerm } });
            // Optional: close search bar after search or keep it open
            this.isSearchOpen = false;
        }
    }
}
