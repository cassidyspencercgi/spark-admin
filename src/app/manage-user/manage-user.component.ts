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
import { InviteUserComponent } from './invite-user/invite-user.component';
import { InviteUserService } from './invite-user-service';

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
    MatSlideToggleModule,
    InviteUserComponent
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {
  service: Service = inject(Service);
  inviteUserService: InviteUserService = inject(InviteUserService);
  users: User[] = [];

  displayedColumns: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled'];
  displayedColumnsPending: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled','resend_email'];
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
      const enabledFilter = this.enabledChecked && user.app_user_enabled && user.app_user_ftu === false && user.app_user_type === 1;
      const disabledFilter = this.disabledChecked && !user.app_user_enabled && user.app_user_ftu === false && user.app_user_type === 1;
      return enabledFilter || disabledFilter;
    });
    
    const filteredPendingUsers = this.users.filter((user: User) => {
      const enabledFilter = this.enabledChecked && user.app_user_enabled && user.app_user_ftu && user.app_user_type === 1;
      const disabledFilter = this.disabledChecked && !user.app_user_enabled && user.app_user_ftu && user.app_user_type === 1;
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

  onResend(user: User) {
    user.app_user_password = this.inviteUserService.generatePassword();
    this.inviteUserService.openSaveDialog(user.app_user_name, user.app_user_email, user.app_user_password, "New Login");
    this.service.patchUser({"app_user_password": user.app_user_password}, user.app_user_id);
  }
  
  enableUser(user: User) {
    user.app_user_enabled = true;
    this.service.patchUser({"app_user_enabled": user.app_user_enabled}, user.app_user_id)
    console.log("enabled");
  }
  
  disableUser(user: User) {
    user.app_user_enabled = false;
    this.service.patchUser({"app_user_enabled": user.app_user_enabled}, user.app_user_id)
    console.log("disabled");
  }
}
