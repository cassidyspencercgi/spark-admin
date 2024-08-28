import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ManageAssetComponent } from '../manage-asset/manage-asset.component';
import { CommonModule } from '@angular/common';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ManageAssetComponent, RouterLink, CommonModule, NavComponent],
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