import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ProductinfoComponent } from './productmanagment/productinfo/productinfo.component';
import { ListproductComponent } from './productmanagment/listproduct/listproduct.component';
import { WishlistComponent } from './productmanagment/wishlist/wishlist.component';
import { RegisterComponent } from './usermanagment/register/register.component';
import { ProfileComponent } from './usermanagment/profile/profile.component';
import { ShoppingcartComponent } from './productmanagment/shoppingcart/shoppingcart.component';
import { NotfoundComponent } from './core/notfound/notfound.component';

export const routes: Routes = [
    { path : '', component: HomeComponent },
    { path : 'home', redirectTo: '' },
    { path: 'produto/:id', component: ProductinfoComponent },
    { path: 'homem/todos', component: ListproductComponent },
    { path: 'wishlist/:id', component: WishlistComponent },
    { path: 'shoppingcart/:id', component: ShoppingcartComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path : '**', component: NotfoundComponent}
];
