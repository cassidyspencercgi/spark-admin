import { Component, inject } from '@angular/core';
import { Service } from '../../service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { Asset } from '../../asset';
import { CategoryService } from '../../category.service';
import { TypeService } from '../../type.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../category';
import { AssetType } from '../../asset.type';
import { ErrorDialog, SaveAssetDialog } from '../create-asset/create-asset.component';

@Component({
  selector: 'app-edit-asset',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormField, MatLabel, MatSelectModule, MatInput, CommonModule, FormsModule, MatButton, MatFormFieldModule, ReactiveFormsModule, NgIf],
  templateUrl: './edit-asset.component.html',
  styleUrl: './edit-asset.component.css'
})
export class EditAssetComponent {

  service: Service = inject(Service);
  categoryService: CategoryService = inject(CategoryService);
  typeService: TypeService = inject(TypeService);

  readonly dialog = inject(MatDialog);
  editAssetForm: FormGroup;

  assetId!: string;
  oldAsset!: Asset;
  assetCategory!: string;
  assetType!: string;

  categoryNames: string[] = [];
  typeNames: string[] = [];

  newAsset: Asset = {
    'asset_id': 1,
    'asset_name': '',
    'asset_category_id': 1,
    'asset_type_id': 1,
    'asset_url': '' 
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.editAssetForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      asset_category: new FormControl('', [Validators.required]),
      asset_type: new FormControl('', [Validators.required]),
      asset_url: new FormControl('', [Validators.required]),
    })
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.assetId = params.get('id') ?? "";
    })

    this.service.getCategories()
    .then((c: Category[]) => {
      c.forEach((c) => {
        this.categoryNames.push(c.category_name);
      })
    });

    this.service.getTypes()
        .then((t: AssetType[]) => {
          t.forEach((t) => {
            this.typeNames.push(t.asset_type_name);
          })
        });

        this.fetchAssetDetails();
  }

  async fetchAssetDetails() {
    this.service.getAsset(Number(this.assetId)).then(a => {
      this.oldAsset = a;
       this.categoryService.getNamebyId(a.asset_category_id).then(n => {
         this.assetCategory = n;
       });
      this.typeService.getNamebyId(a.asset_category_id).then(n => {
         this.assetType = n;
      });
  });
  }

  async saveAsset() {
    if (this.editAssetForm.valid) {
      let categoryId = await this.categoryService.getIdbyName(this.editAssetForm.get('asset_category')?.value);
      let typeId = await this.typeService.getIdbyName(this.editAssetForm.get('asset_type')?.value);
            
      this.newAsset = {
        asset_id: -1,
        asset_name: this.editAssetForm.get('name')?.value,
        asset_category_id: categoryId,
        asset_type_id: typeId,
        asset_url: this.editAssetForm.get('asset_url')?.value
      }
      await this.service.editAsset(Number(this.assetId), this.newAsset);

      this.openDialog(this.newAsset.asset_name);
      this.editAssetForm.reset();

      this.newAsset = {
        asset_id: 1,
        asset_name: '',
        asset_category_id: 1,
        asset_type_id: 1,
        asset_url: ''
      }
    }
    else {
      this.openErrorDialog();
      console.log("error")
    }
  }

  openDialog(asset_name: string): void {
    const dialogRef = this.dialog.open(SaveAssetDialog, {
      data: { asset_name: asset_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.editAssetForm.reset(); 
  }

  openErrorDialog(): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.editAssetForm.reset();
  }
}