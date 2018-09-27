import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ContentItemMessageModel, ContentItemMessageSubstitution } from 'services/content-item.service';

@Component({
  selector: 'app-cim-messages-list',
  templateUrl: './cim-messages-list.component.html',
  styleUrls: ['./cim-messages-list.component.css']
})
export class CimMessagesListComponent implements OnInit {
  @Input() messages: ContentItemMessageModel[] = [];
  @Input() substitutions: ContentItemMessageSubstitution[] = [];
  @Input() hideSentMessages = true;

  @Output() onDeleteMessage = new EventEmitter<string>();
  @Output() onEditMessage = new EventEmitter<string>();

  // List of messages that will actually be shown to the user
  messagesList: ContentItemMessageModel[] = [];

  constructor() {
  }

  ngOnInit() {
    this.redraw();
  }

  // Updates the message list with the view the user wants to see
  public redraw(hideMessagesInThePast?: boolean) {
    // HACK: Make sure we are showing the right items
    if(hideMessagesInThePast !== undefined) {
      this.hideSentMessages = hideMessagesInThePast;
    }

    if (this.messages && this.messages.length > 0) {
      // Sort the messages
      this.messagesList = this.sortMessages();
    } else {
      // No messages to show
      this.messagesList = [];
    }
  }

  // Sort the list of messages based on what the user wants to see
  private sortMessages(): ShowContentItemMessageModel[] {
    const outputMessages: ShowContentItemMessageModel[] = [];

    // Sort the messages by date
    const list = this.messages.sort((one, two) => (one.SendTime > two.SendTime ? 1 : -1));

    // Loop through all the messages, update them to the display type and remove any that should not be shown
    list.forEach(item => {

      // Clone the object as changing it changes the objects stored in the parent object
      const msg = Object.assign({}, item) as ShowContentItemMessageModel;

      if (this.messageIsInThePast(item)) {
        // Messages is in the past
        if (!this.hideSentMessages) {
          // Past messages should be shown, add it too the list
          msg.hasBeenSent = true;
          msg.Message = this.performSubstitutions(msg.Message);
          outputMessages.push(msg);
        }
      } else {
        // This message hasn't been sent yet
        msg.hasBeenSent = false;
        msg.Message = this.performSubstitutions(msg.Message);
        outputMessages.push(msg);
      }
    });

    // Return the new message list
    return outputMessages;
  }

  // Is a message in the past
  private messageIsInThePast(message: ContentItemMessageModel): boolean {
    if (!message.SendTime) { return false; }
    return message.SendTime < new Date().toISOString();
  }

  // Called when the user wants to delete an item
  deleteMessage(id: string) {
    this.onDeleteMessage.emit(id);
  }

  // Called whent he user wants to edit an item
  editMessage(message: ContentItemMessageModel) {
    this.onEditMessage.emit(message.Id);
  }

  // Do the substitutions for any piece of text
  protected performSubstitutions(input: string): string {
    if (!input) { return ''; }

    let output = input;
    this.substitutions.forEach(sub => {
      const target = `{${sub.name}}`;
      output = output.replace(target, `<strong>${sub.value}</strong>`);
    });

    return output;
  }
}

// Extend the Content item message model with a boolean to show if it has already been sent
export class ShowContentItemMessageModel extends ContentItemMessageModel {
  hasBeenSent: boolean;
}