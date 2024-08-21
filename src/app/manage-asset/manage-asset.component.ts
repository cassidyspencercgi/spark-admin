import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Asset } from '../asset'
import { AssetService } from '../assets.service';

@Component({
  selector: 'app-manage-asset',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatTableModule, MatButtonModule],
  templateUrl: './manage-asset.component.html',
  styleUrl: './manage-asset.component.css'
})
export class ManageAssetComponent {
  assetService: AssetService = inject(AssetService);
  assetsList: Asset[] = [];
  displayedColumns: string[] = ['asset_name', 'asset_category_id', 'asset_type', 'asset_url'];
  route: ActivatedRoute = inject(ActivatedRoute);
  dataSource = new MatTableDataSource();

  ngOnInit() : void {
    this.assetService.getAssets().then((assets: Asset[]) => {
      this.dataSource.data = assets;
    })

    console.log(this.dataSource);
  }
}