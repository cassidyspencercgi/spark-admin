import { Injectable } from "@angular/core";
import { Asset } from "./asset";
import { Login } from "./login";

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    baseurl = 'http://localhost:8000/autismapp'
    token : String = ''
    adminUser : Login = {login_email: 'user', login_password: 'pass'}
   
    constructor() {
        this.authorizeUser(this.adminUser).then(jwt => {
            this.token = jwt;
            console.log(jwt);

            this.getAssets().then(assets => {
                console.log(assets);
            });
        });
    }

    async getAssets() : Promise<Asset[]> {
        const data = await fetch(this.baseurl + "/asset/v1",
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
            throw new Error(`Failed to fetch assets`);
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
}