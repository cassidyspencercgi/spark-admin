import { Component, inject, NgModule, ViewChild } from '@angular/core';
import { User } from '../user';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterOutlet, 
    MatTableModule, 
    MatButtonModule, 
    MatSortModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {
  service: Service = inject(Service);
  users: User[] = [];

  displayedColumns: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled'];
  dataSource = new MatTableDataSource<User>();
  
  enabledChecked = true;
  disabledChecked = true;

  ngOnInit(): void {
    this.service.getUsers().then((users: User[]) => {
      this.users = users;
      this.dataSource.data = users;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.dataSource.data = this.users.filter((user: User) => {
      const enabledFilter = this.enabledChecked && user.app_user_enabled;
      const disabledFilter = this.disabledChecked && !user.app_user_enabled;
      return enabledFilter || disabledFilter;
    });
  }
}
