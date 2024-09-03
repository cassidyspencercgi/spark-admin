import { CommonModule, NgIf } from "@angular/common";
import { Component, Inject, inject, Injectable } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { SaveAssetDialog } from "../manage-asset/create-asset/create-asset.component";
import { Clipboard } from "@angular/cdk/clipboard";
import { MatTooltipModule } from "@angular/material/tooltip";

@Injectable({
    providedIn: 'root'
  })
  export class InviteUserService {
    readonly dialog = inject(MatDialog);
    generatePassword(): string {
      return Array(10)
        .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$")
        .map(x => x[Math.floor(Math.random() * x.length)])
        .join('');
    }
    
    openSaveDialog(pName: String, pEmail: String, pPassword: String, pTitle: String): void {
        const dialogRef = this.dialog.open(UserSavedDialog, {
          data: { name: pName,
                  email: pEmail,
                  password: pPassword,
                  title: pTitle }
        })
      }
  }


  @Component({
    selector: 'save-user-dialog',
    templateUrl: 'save-user-dialog.html',
    styleUrl: 'save-user-dialog.css',
    standalone: true,
    imports: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      MatButtonModule,
      CommonModule,
      NgIf,
      RouterLink,
      MatTooltipModule
    ],
  })
  
  export class UserSavedDialog {
    readonly dialogRef = inject(MatDialogRef<SaveAssetDialog>);
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: {name:String, email:String, password:String, title: String}, private clipboard: Clipboard){}
  
    getMailtoLink(): string {
      const body = `Hello ${this.data.name},\n\nI would like to invite you to join SPARK. Here is your username and password to login. `+
                    `\n\n\tUsername: ${this.data.email}\n\tPassword: ${this.data.password}\n\nYou will be asked to change this password upon logging in.`
                    + `\n\nThanks for trying out this app!`;
      return `mailto:${this.data.email}?subject=${encodeURIComponent("Welcome to Spark!")}&body=${encodeURIComponent(body)}`;
    }
    onClick(): void {
      this.dialogRef.close();
    }
    copyEmail() {
        const body = `Hello ${this.data.name},\n\nI would like to invite you to join SPARK. Here is your username and password to login. `+
        `\n\n\tUsername: ${this.data.email}\n\tPassword: ${this.data.password}\n\nYou will be asked to change this password upon logging in`
        + `\n\nThanks for trying out this app!`;
        this.clipboard.copy(body);
      }
  }