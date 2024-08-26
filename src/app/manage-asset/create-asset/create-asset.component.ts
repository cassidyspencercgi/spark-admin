import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { AssetService } from '../../assets.service';
import { ManageAssetComponent } from '../manage-asset.component';
import { Asset } from '../../asset';
import { Category } from '../../category';
import { AssetType } from '../../asset.type';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule,
            FormsModule,
            RouterLink,
            MatButton,
            MatSelectModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            MatInputModule
            
  ],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css'
})
export class CreateAssetComponent {
  assetService: AssetService = inject(AssetService);
  addAssetForm: FormGroup;

  categoryNames: string[] = [];
  typeNames: string[] = [];

  newAsset: Asset = {
    'asset_id': 1,
    'asset_name': '',
    'asset_category_id': 1,
    'asset_type_id': 1,
    'asset_url': '' 
  };

  constructor(private fb: FormBuilder) {
    this.addAssetForm = this.fb.group({
      name: ['', Validators.required],
      asset_category: ['', Validators.required],
      asset_type: ['', Validators.required],
      asset_url: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.assetService.getCategories()
                        .then((c: Category[]) => {
                          c.forEach((c) => {
                            this.categoryNames.push(c.category_name);
                          })
                        });
    this.assetService.getTypes()
                        .then((t: AssetType[]) => {
                          t.forEach((t) => {
                            this.typeNames.push(t.asset_type_name);
                          })
                        });
  }

  submitAsset(): void {
    if (this.addAssetForm.valid) {
      this.newAsset = {
        asset_id: -1,
        asset_name: this.addAssetForm.get('name')?.value,
        asset_category_id: this.categoryIdByName(this.addAssetForm.get('asset_category')?.value),
        asset_type_id: this.typeIdByName(this.addAssetForm.get('asset_type')?.value),
        asset_url: this.addAssetForm.get('url')?.value
      }
      this.newAsset = this.addAssetForm.value;

      this.assetService.createAsset(this.newAsset);
      console.log(this.newAsset);

      this.newAsset = {
        asset_id: 1,
        asset_name: '',
        asset_category_id: 1,
        asset_type_id: 1,
        asset_url: ''
      }
      this.addAssetForm = this.fb.group({
        name: ['', Validators.required],
        asset_category: ['', Validators.required],
        asset_type: ['', Validators.required],
        asset_url: ['', Validators.required]
      })

    }
  }

  categoryIdByName(cat_name: string) : number {
    let categoryId = 0;
    this.assetService.getCategoryIdbyName(cat_name)
                                .then((i: number) => 
                                  {categoryId = i;})
    return categoryId;
  }

  typeIdByName(type_name: string) : number {
    let typeId = 0;
    this.assetService.getCategoryIdbyName(type_name)
                                .then((i: number) => 
                                  {typeId = i;})
    return typeId;
  }
}
