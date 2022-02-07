import { Component } from '@angular/core';
import { AuthService } from '@auth/services/auth.services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // user$ observable used to switch logout template on or off
  user$ = this.authSvc.user$;

  constructor(private readonly authSvc: AuthService) { }

  // call signout function from auth service & catch errors
  async onLogout(): Promise<void> {
    try {
      await this.authSvc.signOut();
    } catch (error) {
      console.log(error);
    }
  }

}
