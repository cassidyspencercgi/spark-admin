import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AssetComponent } from './asset/asset.component';
import { CreateAssetComponent } from './manage-asset/create-asset/create-asset.component';
import { ManageAssetComponent } from './manage-asset/manage-asset.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path : 'home',
        component : HomeComponent,
        children: [
        {   path: 'assets', 
            component: ManageAssetComponent,
        },
        {
            path: 'assets/add',
            component: CreateAssetComponent
        }],
        title : 'Home Page'
    },
    {
        path : 'login', 
        component : LoginComponent,
        title: 'Login Page'
    },
    {
        path : '',
        redirectTo : 'login',
        pathMatch : 'full'
    }
];