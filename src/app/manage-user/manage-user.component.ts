import { Component, inject, ViewChild } from '@angular/core';
import { User } from '../user';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../service';

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
    service: Service = inject(Service);
    users: User[] = []

    displayedColumns: string[] = ['app_user_name', 'app_user_email', 'app_user_enabled'];
    dataSource = new MatTableDataSource();
    
    ngOnInit() : void {
      this.service.getUsers().then((users: User[]) => {
        this.users = users;
        this.dataSource.data = users;
      })
    }

}
