import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateAssetComponent } from './manage-asset/create-asset/create-asset.component';
import { ManageAssetComponent } from './manage-asset/manage-asset.component';
import { LoginComponent } from './login/login.component';
import { EditAssetComponent } from './manage-asset/edit-asset/edit-asset.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

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
        },
        {
            path: 'assets/edit/:id',
            component: EditAssetComponent
        },
        {
            path: 'users',
            component: ManageUserComponent
        }
        ],
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