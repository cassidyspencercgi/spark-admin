import { Component, inject, input, computed} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AssetService } from '../assets.service';
import { Login } from '../login';
import { FormsModule } from '@angular/forms';

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
      console.log('WRONG LOGIN');
    });
  }
}