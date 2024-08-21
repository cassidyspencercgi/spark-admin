import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AssetComponent } from '../asset/asset.component';
import { ManageAssetComponent } from '../manage-asset/manage-asset.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, AssetComponent, ManageAssetComponent, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  component: string;

  constructor() {
    this.component = this.route.snapshot.params['component'];
  }
}