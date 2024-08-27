import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Asset } from '../asset'
import { Service } from '../service';
import { Login } from '../login';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CategoryService } from '../category.service';
import { TypeService } from '../type.service';

@Component({
  selector: 'app-manage-asset',
  standalone: true,
  imports: [CommonModule, 
            RouterLink, 
            RouterOutlet, 
            MatTableModule, 
            MatButtonModule, 
            MatSortModule,
            MatSort
            ],
  templateUrl: './manage-asset.component.html',
  styleUrl: './manage-asset.component.css'
})
export class ManageAssetComponent {
  service: Service = inject(Service);
  categoryService: CategoryService = inject(CategoryService);
  typeService: TypeService = inject(TypeService);
  
  assetsList: Asset[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  
  component: string;
  displayedColumns: string[] = ['asset_name', 'asset_category_id', 'asset_type_id', 'asset_url', 'edit'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  
  readonly dialog = inject(MatDialog);

  assets: Asset[] = [];
  categoryNames: { [key: number]: string } = {};
  typeNames: { [key: number]: string } = {};

  @ViewChild(MatTable) table!: MatTable<any>;
  constructor() {
    this.component = this.route.snapshot.params['component'];
  }

  ngOnInit() : void {
        this.service.getAssets().then((assets: Asset[]) => {
          this.assets = assets;
          this.dataSource.data = assets;
          const categoryPromises = assets.map((asset) => {
            return this.categoryService.getNamebyId(asset.asset_category_id).then(name => {
                this.categoryNames[asset.asset_category_id] = name;
            });
        });

        const typePromises = assets.map((asset) => {
            return this.typeService.getNamebyId(asset.asset_type_id).then(name => {
                this.typeNames[asset.asset_type_id] = name;
            });
        });

        // Wait for all category and type names to be fetched
        Promise.all([...categoryPromises, ...typePromises]).then(() => {
            this.dataSource.data = this.assets;
            this.table.renderRows(); // Ensure table is re-rendered
        });
    });
    }

    ngAfterViewInit(): void {
      console.log("inside on AfterViewInit");
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  
    getCategoryName(id: number): string {
      return this.categoryNames[id];
    }
  
    getTypeName(id: number): string {
      return this.typeNames[id];
    }

    openDialog(id: number): void {
      const dialogRef = this.dialog.open(DeleteDialog, {
        data: {},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'yes') {
          this.deleteAsset(id);
        } 
      });      
    }

    deleteAsset(id: number): void {
      console.log(id);
      this.service.deleteAsset(id).then(x => {
        this.service.getAssets().then((assets: Asset[]) => {
          this.dataSource.data = assets;
        });
      });
    }

}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  standalone: true,
  imports: [MatDialogContent,
            MatDialogClose,
            MatDialogActions,
            MatDialogTitle,
            MatButtonModule
  ],
})

export class DeleteDialog {
  readonly dialogRef = inject(MatDialogRef<DeleteDialog>);

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
}
