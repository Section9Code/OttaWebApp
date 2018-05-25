import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-invite-afriend',
  templateUrl: './invite-afriend.component.html',
  styleUrls: ['./invite-afriend.component.css']
})
export class InviteAfriendComponent implements OnInit {
  shareCode = '';
  shareLink = '';

  constructor(
    private userService: UserService,
    private toast: ToastsManager
  ) { }

  ngOnInit() {
    // Get the users settings
    this.userService.getSettings().toPromise()
      .then(response => {
        console.log('Loaded settings', response);
        this.shareCode = response.SendAFriendCode;
        this.shareLink = `https://app.otta.io/join?t=friend&code=${this.shareCode}`;
      })
      .catch();
  }

  share() {
    const el = document.createElement('textarea');
    el.value = this.shareLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toast.info('Your friend link has been copied to your clipboard.', 'Link copied');
  }
}
