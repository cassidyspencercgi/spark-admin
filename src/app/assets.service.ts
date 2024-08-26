import { inject, Injectable } from "@angular/core";
import { Asset } from "./asset";
import { Login } from "./login";
import { Router } from "@angular/router";
import { PathVariables } from "./path.variables";
import { Category } from "./category";
import { AssetType } from "./asset.type";
@Injectable({
    providedIn: 'root'
})
export class AssetService {
    baseurl = 'http://localhost:8000/autismapp'
    private _token : string = ''
    router: Router = inject(Router);
    path: PathVariables = inject(PathVariables);

   
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
    /***********************Asset***********************/
    async createAsset(newAsset: Asset) {
        fetch(this.baseurl + this.path.ASSET, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAsset),
          })
    }

    async getAssets() : Promise<Asset[]> {
        const data = await fetch(this.baseurl + this.path.ASSET,
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
            this.router.navigate(['/login/']);
            throw new Error(`Error in get assets function`);
        }
    }

    /***********************Category***********************/
    async getCategories() : Promise<Category[]> {
        const data = await fetch(this.baseurl + this.path.CATEGORY,
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
            this.router.navigate(['/assets/']);
            throw new Error(`Error in getting categories`);
        }
    }

    async getCategoryIdbyName(name: string) : Promise<number> { ///TODOOOOO
        const data = await fetch(this.baseurl + this.path.CATEGORY + '?category_name=' + name,
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
            this.router.navigate(['/assets/']);
            throw new Error(`Error in getting categories`);
        }
    }

    /***********************Asset Type***********************/
    async getTypes() : Promise<AssetType[]> {
        const data = await fetch(this.baseurl + this.path.TYPE,
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
            this.router.navigate(['/assets/']);
            throw new Error(`Error in getting types`);
        }
    }

    async getTypeIdbyName(name: string) : Promise<number> { ///TODOOOO
        const data = await fetch(this.baseurl + this.path.CATEGORY + 'type' + name,
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
            this.router.navigate(['/assets/']);
            throw new Error(`Error in get type id by name`);
        }
    }

    /***********************Auth***********************/
    async authorizeUser(adminUser : Login) : Promise<string> {
        const data = await fetch(this.baseurl + this.path.AUTH, {
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
}