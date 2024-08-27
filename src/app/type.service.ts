import { inject, Injectable } from "@angular/core";
import { Service } from "./service";
import { AssetType } from "./asset.type";

@Injectable({
    providedIn: 'root'
})
export class TypeService {
    service: Service = inject(Service);

    getNamebyId(id: number) : Promise<string> {
        return this.service.getType(id).then((t: AssetType) => {
            let type_name = t.asset_type_name;
            return type_name;
        });
    }

    getIdbyName(name: string) : Promise<number> {
        return this.service.getTypes().then((c: AssetType[]) => {
            let type_id = 0;
            c.forEach((type) => {
                if(type.asset_type_name === name) {
                    type_id = type.asset_type_id;
                }
            });
            return type_id;
        });
    }   
}