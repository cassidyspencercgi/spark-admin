import { Injectable } from "@angular/core";
import { Asset } from "./asset";

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    baseurl = 'http://localhost:3000'

    constructor() {}

    async getAssets() : Promise<Asset[]> {
        const data = await fetch(this.baseurl);
        return await data.json() ?? [];
    }
}