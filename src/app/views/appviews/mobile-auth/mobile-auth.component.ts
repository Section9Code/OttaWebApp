import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-mobile-auth',
  templateUrl: './mobile-auth.component.html',
  styleUrls: ['./mobile-auth.component.css']
})
export class MobileAuthComponent implements OnInit {
  shortCode: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  generate() {
    this.userService.getMobileShortCode().toPromise()
    .then(response => this.shortCode = response)
    .catch(
      error => {
        console.log('Error getting short code for user', error);
      }
    );
  }
}
