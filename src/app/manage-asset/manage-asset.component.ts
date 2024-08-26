import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Asset } from '../asset'
import { Service } from '../service';
import { Login } from '../login';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-asset',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatTableModule, MatButtonModule],
  templateUrl: './manage-asset.component.html',
  styleUrl: './manage-asset.component.css'
})
export class ManageAssetComponent {
  service: Service = inject(Service);
  assetsList: Asset[] = [];
  adminUser : Login = {login_email: 'user', login_password: 'pass'}
  displayedColumns: string[] = ['asset_name', 'asset_category_id', 'asset_type_id', 'asset_url', 'edit'];
  route: ActivatedRoute = inject(ActivatedRoute);
  dataSource = new MatTableDataSource();
  readonly dialog = inject(MatDialog);


  ngOnInit() : void {
        this.service.getAssets().then((assets: Asset[]) => {
          this.dataSource.data = assets;
        });
    }

    openDialog(id: number): void {
      const dialogRef = this.dialog.open(DeleteDialog, {
        data: {},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result === 'yes') {
          console.log("yes to delete")
        } 
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
