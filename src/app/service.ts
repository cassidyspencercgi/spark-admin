import { inject, Injectable } from "@angular/core";
import { Asset } from "./asset";
import { Login } from "./login";
import { Router } from "@angular/router";
import { PathVariables } from "./path.variables";
import { Category } from "./category";
import { AssetType } from "./asset.type";
import { User } from "./user";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Service {
    baseurl = 'http://localhost:8000/autismapp'
    private _token : string = ''
    router: Router = inject(Router);
    path: PathVariables = inject(PathVariables);

   
     constructor(private http: HttpClient) {
     }

    set token(value: string) {
        this._token = value;
    }
    
    get token() {
        return this._token;
    }
    /***********************Asset***********************/
    async createAsset(newAsset: Asset): Promise<string> {
        console.log("createAsset: " + this.baseurl + this.path.ASSET);
        console.log(JSON.stringify(newAsset));
      
        try {
            const response = await firstValueFrom(
              this.http.post<Asset>(this.baseurl + this.path.ASSET, 
                newAsset,
                {
                  headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                  },
                  observe: 'response',
                }
              )
            );
            
            if (response.status === 200) {
              return "ok";
            } else if (response.status === 403) {
              this.router.navigate(['/login']);
              return "error";
            }
            else{
                return "error";
            }
          } catch (error) {
            console.error('Error creating asset:', error);
            this.router.navigate(['/login']);
            return "error";
          }
        }

    async getAssets(): Promise<Asset[]> {
        console.log("getAssets: " + this.baseurl + this.path.ASSET);
        try {
          const response = await firstValueFrom(
            this.http.get<Asset[]>(this.baseurl + this.path.ASSET, { 
            headers: {
                'Authorization': `Bearer ${this.token}`,
                 'Content-Type': 'application/json'
            },
            observe: 'response' })
          );
    
          return response.body || [];
        } catch (error) {
          console.error('Error fetching assets:', error);
          this.router.navigate(['/login']);
          return [];
        }
    }

    async getAsset(id: number): Promise<Asset> {
        console.log("getAsset: " + this.baseurl + this.path.ASSET + id);
        try {
          const response = await firstValueFrom(
            this.http.get<Asset>(
              this.baseurl + this.path.ASSET + id,
              {
                headers: {
                  'Authorization': `Bearer ${this.token}`,
                  'Content-Type': 'application/json'
                },
                observe: 'body'
              }
            )
          );
      
          return response;
        } catch (error) {
          console.error('Error fetching asset:', error);
          this.router.navigate(['/login']);
          throw error;
        }
      }

    async editAsset(id: number, asset: Asset) {
        console.log("edit asset: " + id)
        try {
            const response = await firstValueFrom(
              this.http.put<Asset>(
                this.baseurl + this.path.ASSET + id,
                asset,
                {
                  headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                  },
                  observe: 'body'
                }
              )
            );
        
            return response;
          } catch (error) {
            console.error('Error fetching asset:', error);
            this.router.navigate(['/login']);
            throw error;
          }
        }

        async deleteAsset(id: number): Promise<void> {
            console.log("deleteAsset: " + this.baseurl + this.path.ASSET + id);
            try {
              await firstValueFrom(
                this.http.delete<void>(this.baseurl + this.path.ASSET + id, {
                  headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                  }
                })
              );
            } catch (error) {
              console.error('Error deleting asset:', error);
              throw error;
            }
          }
          

    /***********************Category***********************/
    async getCategories() : Promise<Category[]> {
        console.log("getCategories: " + this.baseurl + this.path.CATEGORY);
        try {
            const response = await firstValueFrom(
              this.http.get<Category[]>(this.baseurl + this.path.CATEGORY, { 
              headers: {
                  'Authorization': `Bearer ${this.token}`,
                   'Content-Type': 'application/json'
              },
              observe: 'response' })
            );
      
            return response.body || [];
          } catch (error) {
            console.error('Error fetching categories:', error);
            this.router.navigate(['/home/assets']);
            return [];
          }
    }

    async getCategory(id: number) : Promise<Category> {
            try {
                const response = await firstValueFrom(
                  this.http.get<Category>(
                    this.baseurl + this.path.CATEGORY + "?category_id=" + id,
                    {
                      headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                      },
                      observe: 'body'
                    }
                  )
                );
            
                return response;
              } catch (error) {
                console.error('Error fetching asset:', error);
                this.router.navigate(['/login']);
                throw error;
              }
    }

    /***********************Asset Type***********************/
    async getTypes() : Promise<AssetType[]> {
        console.log("getTypes: " + this.baseurl + this.path.TYPE);
        try {
            const response = await firstValueFrom(
              this.http.get<AssetType[]>(this.baseurl + this.path.TYPE, { 
              headers: {
                  'Authorization': `Bearer ${this.token}`,
                   'Content-Type': 'application/json'
              },
              observe: 'response' })
            );
      
            return response.body || [];
          } catch (error) {
            console.error('Error fetching types:', error);
            this.router.navigate(['/home/assets']);
            return [];
          }
    }

    async getType(id: number) : Promise<AssetType> {
        try {
            const response = await firstValueFrom(
              this.http.get<AssetType>(
                this.baseurl + this.path.TYPE + id,
                {
                  headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                  },
                  observe: 'body'
                }
              )
            );
        
            return response;
          } catch (error) {
            console.error('Error fetching types:', error);
            this.router.navigate(['/asset']);
            throw error;
          }
    }

    /***********************Auth***********************/
    async authorizeUser(adminUser : Login) : Promise<string> {
        console.log("authorize user: " + this.baseurl + this.path.AUTH);

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

        /***********************User***********************/
        async getUsers() : Promise<User[]> {
            console.log("getUsers: " + this.baseurl + this.path.USER);
        try {
          const response = await firstValueFrom(
            this.http.get<User[]>(this.baseurl + this.path.USER, { 
            headers: {
                'Authorization': `Bearer ${this.token}`,
                 'Content-Type': 'application/json'
            },
            observe: 'response' })
          );
    
          return response.body || [];
        } catch (error) {
          console.error('Error fetching users:', error);
          this.router.navigate(['/login']);
          return [];
        }
    }
        
        async createUser(newUser: User) : Promise<string>{
            console.log("createUser: " + this.baseurl + this.path.USER);
            console.log(JSON.stringify(newUser))
                        
            try {
                const response = await firstValueFrom(
                this.http.post(this.baseurl + this.path.USER, newUser, {
                    headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                    },
                    observe: 'response',
                    responseType: 'text'
                })
                );

                if (response.status === 200) {
                return response.body || "ok";
                } else if (response.status === 403) {
                this.router.navigate(['/login']);
                return "error";
                } else {
                return "error";
                }
            } catch (error) {
                console.error('Error creating user:', error);
                this.router.navigate(['/home/users']);
                return "error";
            }
        }

        async patchUser(user: any, id: number) {            
            console.log("patch user: " + this.baseurl + this.path.USER + id)
            try {
                const response = await firstValueFrom(
                  this.http.patch<User>(
                    this.baseurl + this.path.USER + id,
                    user,
                    {
                      headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                      },
                      observe: 'body'
                    }
                  )
                );
            
                return response;
              } catch (error) {
                console.error('Error editing user:', error);
                this.router.navigate(['/home/users']);
                throw error;
              }
            }
}