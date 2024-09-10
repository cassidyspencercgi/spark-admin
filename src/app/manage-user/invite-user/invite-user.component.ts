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
import { InviteUserService } from '../invite-user-service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';

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
  inviteUserService: InviteUserService = inject(InviteUserService);

  readonly dialog = inject(MatDialog);
  addUserForm: FormGroup;

  password: String = '';

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
    const emailRegex = /^\S+@\S+\.\S+$/;
    const email = this.addUserForm.get('app_user_email')?.value;

    if (this.addUserForm.valid) {

      if(emailRegex.test(email)) {
        this.password = this.inviteUserService.generatePassword();
        this.newUser = {
          app_user_id: -1,
          app_user_email: email,
          app_user_name: this.addUserForm.get('app_user_name')?.value,
          app_user_ftu: true,
          app_user_enabled: true,
          app_user_parent_passcode: '1234',
          app_user_password: this.password,
          app_user_root_user_id: undefined, 
          app_user_type: 1
        }

        try{
          let response = await this.service.createUser(this.newUser);
          this.newUser.app_user_id = Number(JSON.parse(response).user_id);
          console.log(this.newUser);
          this.newUser.app_user_root_user_id = this.newUser.app_user_id;
          this.service.patchUser({"app_user_root_user_id": this.newUser.app_user_root_user_id}, this.newUser.app_user_id);
          this.addUserForm.reset();
          console.log('saved user: ' + JSON.parse(response).user_id);  

          this.inviteUserService.openSaveDialog(this.newUser.app_user_name, this.newUser.app_user_email, this.password, "New User");    
        } catch(e) {
            if(e instanceof Error)
            this.openErrorDialog("Error Adding User. Message: " + e.message);
            console.log(e);
        }
    }
    else {
      this.openErrorDialog("Invalid email format")
    }
  }
  else {
    console.log('error saving user');
    this.openErrorDialog("Error Adding User");
    }
  }

  openErrorDialog(message: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: { message: message}
    });

  dialogRef.afterClosed().subscribe(result => {
  });
  this.addUserForm.reset();
}

generatePassword(): void {
  this.password = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function(x) { 
    return x[Math.floor(Math.random() * x.length)] }).join('');
  }
}