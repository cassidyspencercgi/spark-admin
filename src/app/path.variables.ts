import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class PathVariables {
    
    ASSET: string = "/asset/v1/";
    AUTH: string = "/adminUser/auth/v1/";
    CATEGORY: string = "/category/v1/";
    TYPE: string = "/assetType/v1/";
    USER: string = "/appUser/v1";

}