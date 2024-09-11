import { Component, inject, input, computed} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Service } from '../service';
import { Login } from '../login';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  constructor(private _router: Router) {
  }

  service: Service = inject(Service);
  router: Router = inject(Router);
  readonly dialog = inject(MatDialog);

  username: string = '';
  password: string = '';
  
  newLogin: Login = {
    "username": '',
    "password": ''
  };

  onSubmit() {
    this.newLogin = {
      username: this.username,
      password: this.password
    };

    this.service.authorizeUser(this.newLogin).then(jwt => {
      this.service.token = jwt;
      }).then(() => {
        this.router.navigate(['/home/assets']);
      }).catch(e => {
        this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvalidLoginDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'invalid-login-dialog',
  templateUrl: 'invalid-login-dialog.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ],
})

export class InvalidLoginDialog {
  readonly dialogRef = inject(MatDialogRef<InvalidLoginDialog>);

  onOkClick(): void {
    this.dialogRef.close();
  }
}