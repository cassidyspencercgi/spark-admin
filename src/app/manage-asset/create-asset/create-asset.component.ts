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

  submitAsset(): void {
    if (this.addAssetForm.valid) {
      console.log(this.newAsset);
    }
  }
}
