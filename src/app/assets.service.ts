import { inject, Injectable } from "@angular/core";
import { Asset } from "./asset";
import { Login } from "./login";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    baseurl = 'http://localhost:8000/autismapp'
    private _token : string = ''
    adminUser : Login = {login_email: 'user', login_password: 'pass'}
    router: Router = inject(Router);
   
     constructor() {
        this._token = localStorage.getItem('authToken') || '';
     }

    set token(value: string) {
        this._token = value;
        localStorage.setItem('authToken', value);
    }
    
    get token() {
        return this._token;
    }

    async getAssets() : Promise<Asset[]> {
        const data = await fetch(this.baseurl + "/asset/v1/",
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        console.log(this.token);
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/login']);
            throw new Error(`Error in get assets function`);
        }
    }

    async authorizeUser(adminUser : Login) : Promise<string> {
        const data = await fetch(this.baseurl + "/adminUser/auth/v1/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminUser)
        });
            if (data.ok) {
                const response = await data.json();
                return response.access_token;
            } else {
                throw new Error(`Failed to fetch assets`);
            } 
    }

    async isUserAuth() : Promise<boolean> {
        const data = await fetch(this.baseurl + "/asset/v1/",
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        console.log(this.token);
        if (data.ok) {
            console.log('true');
            return true;
        } else {
            console.log('false');
            return false;
        }
    }
}