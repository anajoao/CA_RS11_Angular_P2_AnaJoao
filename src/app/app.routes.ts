import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ProductinfoComponent } from './productmanagment/productinfo/productinfo.component';
import { ListproductComponent } from './productmanagment/listproduct/listproduct.component';

export const routes: Routes = [
    { path : '', component: HomeComponent },
    { path : 'home', redirectTo: '' },
    { path: 'produto/:id', component: ProductinfoComponent },
    { path: 'produtos', component: ListproductComponent }
];
