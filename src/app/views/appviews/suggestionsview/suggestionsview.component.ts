import { Component, OnInit } from '@angular/core';
import { SuggestionsService, SuggestionReduced } from "services/suggestions.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { TicksToDatePipe } from "app/components/common/pipes/ticks-to-date.pipe";
import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { Router } from "@angular/router";
import { SweetAlertService } from 'ng2-sweetalert2';

@Component({
  selector: 'app-suggestionsview',
  templateUrl: './suggestionsview.component.html',
  styleUrls: ['./suggestionsview.component.css'],
})
export class SuggestionsViewComponent implements OnInit {
  currentUser: string;
  private suggestions: SuggestionReduced[];

  constructor(private suggestionsSvc: SuggestionsService, private mixpanel: MixpanelService, private toast: ToastsManager, private route: Router, private alertSvc: SweetAlertService) {
    this.currentUser = localStorage.getItem("AuthId");
  }

  ngOnInit() {
    this.mixpanel.Track(MixpanelEvent.View_all_suggestions, { Action: "View all" })
    // Load suggestions
    this.suggestionsSvc.getAll().subscribe(
      response => this.suggestions = response,
      error => console.log('Error occurred while getting suggestions', error),
      () => console.log('Suggestions loaded', this.suggestions)
    )
  }

  upVote(suggestion: SuggestionReduced) {
    console.log('Up Vote', suggestion.id);
    this.mixpanel.Track(MixpanelEvent.Up_vote_suggestion, { Action: "Up vote", Suggestion: suggestion.id });
    this.suggestionsSvc.upVote(suggestion.id).subscribe(
      response => {
        if (response.Success) {
          this.toast.success('Suggestion up voted', 'Up vote');
          suggestion.Score++;
        }
        else {
          this.toast.warning('You have already voted on this suggestion', "Up vote");
        }

      },
      error => this.mixpanel.TrackError("Error occured while up voting suggestion", error)
    );
  }

  downVote(suggestion: SuggestionReduced) {
    console.log('Down Vote', suggestion.id);
    this.mixpanel.Track(MixpanelEvent.Down_vote_suggestion, { Action: "Down vote", Suggestion: suggestion.id });
    this.suggestionsSvc.downVote(suggestion.id).subscribe(
      response => {
        if (response.Success) {
          suggestion.Score--;
          this.toast.success('Suggestion down voted', 'Down vote');
        }
        else {
          this.toast.warning('You have already voted on this suggestion', "Down vote");
        }
      },
      error => this.mixpanel.TrackError("Error occured while down voting suggestion", error)
    );
  }

  create() {
    this.route.navigateByUrl('/suggestions/create');
  }

  remove(suggestion: SuggestionReduced) {
    console.log("Remove suggestion", suggestion.id)

    // Ask the user if they are sure they want to remove the suggestion
    this.alertSvc.swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Delete the suggestion
      console.log("Delete suggestion");
      this.suggestionsSvc.remove(suggestion.id).subscribe(
        success => {
          console.log("Response");
          // Success
          if (success) {
            // Suggestion deleted
            console.log("Success");
            let index = this.suggestions.indexOf(suggestion);
            this.suggestions.splice(index, 1);
            this.mixpanel.Track(MixpanelEvent.Remove_Suggestion, { Suggestion: suggestion.id, SuggestionTitle: suggestion.Title });
            this.toast.success("Suggestion has been removed","Remove suggestion");            
          }
          else {
            // Suggestion can't be deleted
            console.log("Can't delete");
            this.toast.error("Unable to delete suggestion");
          }
        },
        error => {
          // Error
          console.log("Error");
          this.mixpanel.TrackError("Error occured while trying to delete suggestion", error);
        },
        () => {
          // Complete
        }
      );
    }).catch(() => { });

    
  }

}
