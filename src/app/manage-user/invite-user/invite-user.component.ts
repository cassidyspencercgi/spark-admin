import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Service } from '../../service';
import { User } from '../../user';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ErrorDialog, SaveAssetDialog } from '../../manage-asset/create-asset/create-asset.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-invite-user',
  standalone: true,
  imports: [CommonModule,
            FormsModule,
            RouterLink,
            MatButton,
            MatSelectModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            MatInputModule,
            NgIf,
            CommonModule],
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.css'
})
export class InviteUserComponent {
  service: Service = inject(Service);

  readonly dialog = inject(MatDialog);
  addUserForm: FormGroup;

  newUser: User = {
    "app_user_id": 1,
    "app_user_email": '',
    "app_user_password": '',
    "app_user_name": '',
    "app_user_type": 1,
    "app_user_root_user_id": 1,
    "app_user_parent_passcode": '',
    "app_user_ftu": true,
    "app_user_enabled": true
  };

  constructor(private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      app_user_email: new FormControl('', [Validators.required]),
      app_user_name: new FormControl('', [Validators.required])
    })
  }

  async submitUser() {
    if (this.addUserForm.valid) {
      this.newUser = {
        app_user_id: -1,
        app_user_email: this.addUserForm.get('app_user_email')?.value,
        app_user_name: this.addUserForm.get('app_user_name')?.value,
        app_user_ftu: true,
        app_user_enabled: true,
        app_user_parent_passcode: '1234',
        app_user_password: 'pass', //generate later
        app_user_root_user_id: undefined, //???????
        app_user_type: 1
      }

      try{
      let response = await this.service.createUser(this.newUser);
      this.newUser.app_user_id = Number(JSON.parse(response).user_id);
      console.log(this.newUser);
      this.service.updateRootUser(this.newUser.app_user_id, this.newUser);
      this.addUserForm.reset();
      console.log('saved user: ' + JSON.parse(response).user_id);  

      this.openSaveDialog(this.newUser.app_user_name, this.newUser.app_user_email, "password");
           
        } catch(e) {
          if(e instanceof Error)
          this.openErrorDialog("Error Adding User. Message: " + e.message);
          console.log(e);
        }
  }
  else {
    console.log('error saving user');
    this.openErrorDialog("Error Adding User");
  }
}


openSaveDialog(pName: String, pEmail: String, pPassword: String): void {
  const dialogRef = this.dialog.open(UserSavedDialog, {
    data: { name: pName,
            email: pEmail,
            password: pPassword }
  }
  )
}

openErrorDialog(message: string): void {
  const dialogRef = this.dialog.open(ErrorDialog, {
    data: { message: message}
  });

  dialogRef.afterClosed().subscribe(result => {
  });
  this.addUserForm.reset();
}

}

@Component({
  selector: 'save-user-dialog',
  templateUrl: 'save-user-dialog.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
    NgIf,
    RouterLink
  ],
})

export class UserSavedDialog {
  readonly dialogRef = inject(MatDialogRef<SaveAssetDialog>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name:String, email:String, password:String}){}

  getMailtoLink(): string {
    const body = `Hello ${this.data.name},\n\nI would like to invite you to join SPARK. Here is your username and password to login. `+
                  `\n\n\tUsername: ${this.data.email}\n\tPassword: ${this.data.password}\n\nYou will be asked to change this password upon logging in.`
                  + `\n\nThanks for trying out this app!`;
    return `mailto:${this.data.email}?subject=${encodeURIComponent("Welcome to Spark!")}&body=${encodeURIComponent(body)}`;
  }
  onClick(): void {
    this.dialogRef.close();
  }
}