import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';

@Component({
    moduleId: module.id,
    selector: 'join',
    templateUrl: 'join.component.html',
    styleUrls: ['join.component.scss']
})
export class JoinComponent implements OnInit {
    showJoinButton = false;
    showJoinOrgMessage = true;
    showJoinFromFriendMessage = false;

    constructor(private auth: AuthService, private router: Router, private mixpanel: MixpanelService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        if (this.auth.isAuthenticated()) {
            // User is already logged in, send them to the home page
            this.router.navigate(['/']);
        }

        // Track the user
        this.mixpanel.Track(MixpanelEvent.Join);

        this.activatedRoute.queryParams.subscribe(
            (params: Params) => {
                const joinType = params['t'];
                console.log('Join params:', joinType);
                switch (joinType) {
                    case 'user':
                        console.log('Store join data: User');

                        // Validate
                        let sid = params['sid'];
                        let oid = params['oid'];
                        if (!sid || !oid) {
                            console.log('No sid or oid supplied');
                            this.router.navigate(['problem']);
                        }

                        // Store the join data and allow the user to join (Organisation User)
                        const joinData: JoinData = new JoinData('user', sid, oid, false, true);
                        localStorage.setItem('joinData', JSON.stringify(joinData));

                        // Show the page
                        this.showJoinButton = true;
                        break;

                    case 'friend':
                        // A users friend is joining :D
                        // Validate
                        console.log('Joining as a friend');
                        const code = params['code'];
                        if (!code) {
                            // No code supplied
                            this.router.navigate(['problem']);
                        }

                        // Store the friend code for when they join
                        const friendJoinData: JoinData = new JoinData('friend', '', '', false, true);
                        friendJoinData.friendCode = code;
                        localStorage.setItem('joinData', JSON.stringify(friendJoinData));

                        // Show the page
                        this.showJoinButton = true;
                        this.showJoinOrgMessage = false;
                        this.showJoinFromFriendMessage = true;
                        break;

                    default:
                        console.log('User is trying to join but no join data found');
                        this.router.navigate(['problem']);
                }
            }
        );
    }
}

export class JoinData {
    type: string;
    senderId: string;
    organisationId: string;
    showCreatorOptions: boolean;
    showOrganisationOptions: boolean;
    friendCode: string;

    constructor(type: string, senderId: string, organisationId: string, showCreatorOptions, showOrganisationOptions) {
        this.type = type;
        this.senderId = senderId;
        this.organisationId = organisationId;
        this.showCreatorOptions = showCreatorOptions;
        this.showOrganisationOptions = showOrganisationOptions;
    }
}
