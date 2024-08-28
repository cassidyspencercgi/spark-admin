import { Component, ViewChild } from '@angular/core';
import { User } from '../user';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule, 
            RouterLink, 
            RouterOutlet, 
            MatTableModule, 
            MatButtonModule, 
            MatSortModule,
            MatSort],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent {

  userList: User[] = [{
    "app_user_id": 0,
    "app_user_email": '',
    "app_user_password": '',
    "app_user_name": '',
    "app_user_type": 0,
    "app_user_root_user_id": 0,
    "app_user_parent_passcode": 0,
    "app_user_ftu": true,
    "app_user_enabled": true
    }]

    displayedColumns: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort)
    sort: MatSort = new MatSort;

}
