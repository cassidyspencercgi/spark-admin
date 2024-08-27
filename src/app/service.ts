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
export class Service {
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
        console.log("createAsset: " + this.baseurl + this.path.ASSET);
        console.log(JSON.stringify(newAsset))
        fetch(this.baseurl + this.path.ASSET, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAsset),
          })
    }

    async getAssets() : Promise<Asset[]> {
        console.log("getAssets: " + this.baseurl + this.path.ASSET);
        const data = await fetch(this.baseurl + this.path.ASSET,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/login']);
            throw new Error(`Error in get assets function`);
        }
    }

    async getAsset(id: number) : Promise<Asset> {
        console.log("getAsset: " + this.baseurl + this.path.ASSET);
        const data = await fetch(this.baseurl + this.path.ASSET + id,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/asset']);
            throw new Error(`Error in get asset function`);
        }
    }

    async editAsset(id: number, asset: Asset) {
        console.log("edit asset: " + id)
        const data = await fetch(this.baseurl + this.path.ASSET + id, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(asset),
          });
          if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
            throw new Error(`Error in edit asset function`);
        }
    }

    async deleteAsset(id: number) {
        console.log(this.baseurl + this.path.ASSET + id);
        await fetch(this.baseurl + this.path.ASSET + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id),
          })
    }

    /***********************Category***********************/
    async getCategories() : Promise<Category[]> {
        console.log("getCategories: " + this.baseurl + this.path.CATEGORY);
        const data = await fetch(this.baseurl + this.path.CATEGORY,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
            throw new Error(`Error in getting categories`);
        }
    }

    async getCategory(id: number) : Promise<Category> {
        const data = await fetch(this.baseurl + this.path.CATEGORY + "?category_id=" + id,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
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
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
            throw new Error(`Error in getting categories`);
        }
    }


    /***********************Asset Type***********************/
    async getTypes() : Promise<AssetType[]> {
        console.log("getTypes: " + this.baseurl + this.path.TYPE);
        const data = await fetch(this.baseurl + this.path.TYPE,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
            throw new Error(`Error in getting types`);
        }
    }

    async getType(id: number) : Promise<AssetType> {
        const data = await fetch(this.baseurl + this.path.TYPE + id,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
            throw new Error(`Error in getting asset types`);
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
        if (data.ok) {
            return data.json();
        } else {
            this.router.navigate(['/assets']);
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
                this.router.navigate(['/login']);
                throw new Error(`Failed to authorize`);
            } 
    }
}