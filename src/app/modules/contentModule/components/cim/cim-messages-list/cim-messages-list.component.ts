import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ContentItemMessageModel } from 'services/content-item.service';

@Component({
  selector: 'app-cim-messages-list',
  templateUrl: './cim-messages-list.component.html',
  styleUrls: ['./cim-messages-list.component.css']
})
export class CimMessagesListComponent implements AfterViewInit {
  // List of all messages to show
  @Input() messages: ContentItemMessageModel[] = [];
  // Should the list show messages in the past
  @Input() hideSentMessages = true;

  // List of messages that will actually be shown to the user
  messagesList: ContentItemMessageModel[] = [];

  constructor() { }

  ngAfterViewInit() {
    this.redraw();
  }

  // Updates the message list with the view the user wants to see
  public redraw() {
    console.log('Redraw', this.hideSentMessages)
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
      if (this.messageIsInThePast(item)) {
        // Messages is in the past
        if (!this.hideSentMessages) {
          // Past messages should be shown, add it too the list
          const msg: ShowContentItemMessageModel = item as ShowContentItemMessageModel;
          msg.hasBeenSent = true;
          outputMessages.push(msg);
        }
      } else {
        // This message hasn't been sent yet
        const msg: ShowContentItemMessageModel = item as ShowContentItemMessageModel;
        msg.hasBeenSent = false;
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

}

// Extend the Content item message model with a boolean to show if it has already been sent
export class ShowContentItemMessageModel extends ContentItemMessageModel {
  hasBeenSent: boolean;
}