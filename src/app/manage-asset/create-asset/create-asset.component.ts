import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { Service } from '../../service';
import { Asset } from '../../asset';
import { Category } from '../../category';
import { AssetType } from '../../asset.type';
import { CategoryService } from '../../category.service';
import { TypeService } from '../../type.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

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
            MatInputModule,
            NgIf
            
  ],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css'
})
export class CreateAssetComponent {
  service: Service = inject(Service);
  categoryService: CategoryService = inject(CategoryService);
  typeService: TypeService = inject(TypeService);

  readonly dialog = inject(MatDialog);
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
      name: new FormControl('', [Validators.required]),
  asset_category: new FormControl('', [Validators.required]),
  asset_type: new FormControl('', [Validators.required]),
  asset_url: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
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
  }

  async submitAsset() {
    if (this.addAssetForm.valid) {
      let categoryId = await this.categoryService.getIdbyName(this.addAssetForm.get('asset_category')?.value);
      let typeId = await this.typeService.getIdbyName(this.addAssetForm.get('asset_type')?.value);
            
      this.newAsset = {
        asset_id: -1,
        asset_name: this.addAssetForm.get('name')?.value,
        asset_category_id: categoryId,
        asset_type_id: typeId,
        asset_url: this.addAssetForm.get('asset_url')?.value
      }
      await this.service.createAsset(this.newAsset);

      this.openDialog(this.newAsset.asset_name);
      this.addAssetForm.reset();

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
    }
  }

  openDialog(asset_name: string): void {
    const dialogRef = this.dialog.open(SaveAssetDialog, {
      data: { asset_name: asset_name}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    this.addAssetForm.reset(); 
  }

  openErrorDialog(): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    this.addAssetForm.reset();
  }
}

@Component({
  selector: 'save-asset-dialog',
  templateUrl: 'save-asset-dialog.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
    NgIf,
    RouterLink
  ],
})

export class SaveAssetDialog {
  readonly dialogRef = inject(MatDialogRef<SaveAssetDialog>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {asset_name: string}){}

  onClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: 'error-dialog.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
    NgIf
  ],
})

export class ErrorDialog {
  readonly dialogRef = inject(MatDialogRef<SaveAssetDialog>);
  
  onOkClick(): void {
    this.dialogRef.close();
  }
}
