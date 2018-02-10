import { Component, OnInit, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { EventEmitter } from 'events';
import { TimeAgoPipe } from 'app/components/common/pipes/timeAgo.pipe';
import { CommentGroupModel, CommentModel, CommentService } from 'services/comment.service';
import { MixpanelService } from 'services/mixpanel.service';

// Example
// <otta-comment [ParentOrganisationId]="" [ParentObjectId]="" (CommentAdded)=""></otta-comment>

@Component({
  selector: 'otta-comment',
  templateUrl: './otta-comment.component.html',
  styleUrls: ['./otta-comment.component.css']
})
export class OttaCommentComponent implements OnInit {
  @Input() ParentObjectId: string;
  @Input() ParentOrganisationId: string;
  @Output() CommentAdded = new EventEmitter();
  isLoading = false;
  isCreatingComment = false;

  // Comments to show to the user
  commentGroup = new CommentGroupModel();

  message: string;

  constructor(private toast: ToastsManager, private commentService: CommentService, private tracking: MixpanelService) { }

  ngOnInit(): void {
    // Check
    if (!this.ParentOrganisationId || !this.ParentObjectId) {
      console.log('UNABLE TO LOAD COMMENTS');
      return;
    }

    // Load the comments
    this.commentService.getComments(this.ParentOrganisationId, this.ParentObjectId).subscribe(
      response => this.commentGroup = response,
      error => {
        if (error.status === 404) {
          // Not found
        }
        else {
          console.log('Unable to load comments', error);
          this.tracking.TrackError('Unable to load comments', error);
        }
      },
      () => this.isLoading = false
    );
  }

  addComment() {
    console.log('Add comment:', this.message);
    let newComment = new CommentModel();
    newComment.Message = this.message;

    this.isCreatingComment = true;
    this.commentService.addComment(this.ParentOrganisationId, this.ParentObjectId, newComment).subscribe(
      response => {
        this.commentGroup = response;
        this.toast.success('Comment added');
        this.message = '';
      },
      error => {
        this.toast.error('Unable to create comment');
      },
      () => this.isCreatingComment = false
    );
  }

  deleteComment(commentId, string) {
    console.log('Delete comment', commentId);
  }

}
