import { inject, Injectable } from "@angular/core";
import { Service } from "./service";
import { Category } from "./category";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    service: Service = inject(Service);

    getNamebyId(id: number) : Promise<string> {
        return this.service.getCategory(id).then((c: Category) => {
            let category_name = c.category_name;
            return category_name;
        });
    }
  
    getIdbyName(name: string): Promise<number> {
        return this.service.getCategories().then((c: Category[]) => {
            let category_id = 0;
            c.forEach((category) => {
                if (category.category_name === name) {
                    category_id = category.category_id;
                }
            });
            console.log("getIdByName: " + name + "," + category_id);
            return category_id;
        });
    }
}