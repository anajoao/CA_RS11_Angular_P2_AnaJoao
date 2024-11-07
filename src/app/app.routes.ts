import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ProductinfoComponent } from './productmanagment/productinfo/productinfo.component';
import { ListproductComponent } from './productmanagment/listproduct/listproduct.component';
import { WishlistComponent } from './productmanagment/wishlist/wishlist.component';
import { RegisterComponent } from './usermanagment/register/register.component';
import { ProfileComponent } from './usermanagment/profile/profile.component';

export const routes: Routes = [
    { path : '', component: HomeComponent },
    { path : 'home', redirectTo: '' },
    { path: 'produto/:id', component: ProductinfoComponent },
    { path: 'homem/todos', component: ListproductComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent }
];
