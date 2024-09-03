import { Component, inject, NgModule, ViewChild } from '@angular/core';
import { User } from '../user';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterOutlet, 
    MatTableModule, 
    MatButtonModule, 
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {
  service: Service = inject(Service);
  users: User[] = [];

  displayedColumns: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled'];
  dataSource = new MatTableDataSource<User>();
  dataSourcePending = new MatTableDataSource<User>();
  
  enabledChecked = true;
  disabledChecked = true;

  ngOnInit(): void {
    this.service.getUsers().then((users: User[]) => {
      this.users = users;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const filteredUsers = this.users.filter((user: User) => {
      const enabledFilter = this.enabledChecked && user.app_user_enabled && user.app_user_ftu === false;
      const disabledFilter = this.disabledChecked && !user.app_user_enabled && user.app_user_ftu === false;
      return enabledFilter || disabledFilter;
    });
    
    const filteredPendingUsers = this.users.filter((user: User) => {
      const enabledFilter = this.enabledChecked && user.app_user_enabled && user.app_user_ftu;
      const disabledFilter = this.disabledChecked && !user.app_user_enabled && user.app_user_ftu;
      return enabledFilter || disabledFilter;
    });

    const sortedData = filteredUsers.sort((a, b) => a.app_user_id - b.app_user_id);
    const sortedPendingData = filteredPendingUsers.sort((a, b) => a.app_user_id - b.app_user_id);

    this.dataSource.data = sortedData;
    this.dataSourcePending.data = sortedPendingData;
  }

  onToggleUserStatus(app_user: any) {
    if (app_user.app_user_enabled) {
      this.enableUser(app_user);
    } else {
      this.disableUser(app_user);
    }
  }
  
  enableUser(user: User) {
    user.app_user_enabled = true;
    this.service.updateUser(user)
    console.log("enabled");
  }
  
  disableUser(user: User) {
    user.app_user_enabled = false;
    this.service.updateUser(user)
    console.log("disabled");
  }
}
