import { Injectable } from "@angular/core";
import { Asset } from "./asset";
import { jwtDecode, JwtPayload } from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    baseurl = 'http://localhost:8000/autismapp/asset/v1/'
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfdXNlcl9pZCI6MSwiZXhwIjoxNzI0MzM2NzcyfQ.kn6AH3uZzGgjtkcVsdg6fd5yHQXUdpbq2lmAzd76b7M'
    constructor() {}

    async getAssets() : Promise<Asset[]> {
        const data = await fetch(this.baseurl,
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
            }
        );
        if (data.ok) {
            return data.json(); // Return an empty array or handle the response differently
        } else {
            throw new Error(`Failed to fetch assets`);
        }
    }
}