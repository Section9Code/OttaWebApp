import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuggestionsService, Suggestion, SuggestionComment } from "services/suggestions.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { AuthService } from "services/auth.service";
import { ToastsManager } from "ng2-toastr/src/toast-manager";
import { SweetAlertService } from 'ng2-sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'suggestion-view',
    templateUrl: 'suggestion-view.component.html',
    styleUrls: ['suggestion-view.component.scss']
})
export class SuggestionViewComponent implements OnInit {
    currentUser: string;
    suggestionId: string;
    suggestion: Suggestion;
    comment: string;
    isLoadingComment: boolean;

    constructor(private suggestionService: SuggestionsService, private route: ActivatedRoute, private mixpanel: MixpanelService, private toast: ToastsManager, private alertSvc: SweetAlertService) {
        this.comment = "";
        this.currentUser = localStorage.getItem("AuthId");
        this.isLoadingComment = false;
    }

    ngOnInit(): void {
        // Load the suggestion
        this.suggestion = new Suggestion();
        this.route.params.subscribe(
            params => {
                // Get the ID of the suggestion
                this.suggestionId = params['id'];
                this.suggestionService.getSingle(this.suggestionId).subscribe(
                    response => {
                        console.log("Got suggestion", response);
                        this.suggestion = response;
                        this.mixpanel.Track(MixpanelEvent.View_Suggestion, { Suggestion: this.suggestion.id })
                    },
                    error => console.log('Error getting subscription', error)
                );
            },
            error => console.log('Error', error)
        );
    }

    addComment() {
        if (this.comment) {
            // Add the comment
            this.isLoadingComment = true;
            this.suggestionService.addComment(this.suggestion.id, this.comment).subscribe(
                response => {
                    // Comment was stored, add it to the page
                    if (this.suggestion.Comments == null) this.suggestion.Comments = [];
                    this.suggestion.Comments.unshift(response);
                    this.mixpanel.Track(MixpanelEvent.Add_Comment_To_Suggestion, { Suggestion: this.suggestion.id, Comment: response.CommentId, CommentText: response.Message });
                    this.toast.info("Added comment");
                },
                error => {
                    console.log("Error occured while trying to add comment", error);
                    this.mixpanel.TrackError("Error occured while trying to add comment", error);
                    this.toast.error("Unable to add comment");
                },
                () => {
                    // Done
                    this.comment = "";
                    this.isLoadingComment = false;
                }
            );
        }
    }

    removeComment(comment: SuggestionComment) {
        console.log("Remove comment", comment);

        // Confirm the user wants to delete this comment
        this.alertSvc.swal({
            title: 'Are you sure?',
            text: "Are you sure you want to remove this comment?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            // The user wants to delete this comment
            this.suggestionService.removeComment(this.suggestion.id, comment.CommentId).subscribe(
                response => {
                    if (response) {
                        // Successfully removed the comment
                        // TODO - Remove from array
                        var index = this.suggestion.Comments.indexOf(comment);
                        this.suggestion.Comments.splice(index, 1);
                        this.mixpanel.Track(MixpanelEvent.Remove_Comment_From_Suggestion, { Suggestion: this.suggestion.id, Comment: comment.CommentId, CommentText: comment.Message });
                        this.toast.info("Removed comment");
                    }
                },
                error => {
                    // Error
                    console.log("Error occured while trying to add comment", error);
                    this.mixpanel.TrackError("Error occured while trying to remove comment", error);
                    this.toast.error("Unable to remove comment");
                },
                () => {
                    // Complete
                }
            );
        }).catch(() => {});





    }

}
