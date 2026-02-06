import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CartComponent } from './features/cart/cart.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) }
];
