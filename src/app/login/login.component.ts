import { Component, inject, input, computed} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AssetService } from '../assets.service';
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

  assetService: AssetService = inject(AssetService);
  router: Router = inject(Router);
  readonly dialog = inject(MatDialog);

  login_email: string = '';
  login_password: string = '';
  
  newLogin: Login = {
    "login_email": '',
    "login_password": ''
  };

  onSubmit() {
    this.newLogin = {
      login_email: this.login_email,
      login_password: this.login_password
    };

    this.assetService.authorizeUser(this.newLogin).then(jwt => {
      this.assetService.token = jwt;
      }).then(() => {
        this.router.navigate(['/home/assets']);
      }).catch(e => {
        this.openDialog();
      console.log('WRONG LOGIN');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvalidLoginDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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