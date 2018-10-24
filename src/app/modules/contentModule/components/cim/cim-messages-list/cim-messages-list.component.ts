import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { ContentItemMessageModel, ContentItemMessageSubstitution } from 'services/content-item.service';

@Component({
  selector: 'app-cim-messages-list',
  templateUrl: './cim-messages-list.component.html',
  styleUrls: ['./cim-messages-list.component.css']
})
export class CimMessagesListComponent implements OnInit, OnChanges {
  @Input() messages: ContentItemMessageModel[] = [];
  @Input() substitutions: ContentItemMessageSubstitution[] = [];
  @Input() hideSentMessages = true;
  @Input() showDates = true;
  @Input() alwaysShowDelete = false;
  @Input() allowMoving = false;

  @Output() onDeleteMessage = new EventEmitter<string>();
  @Output() onEditMessage = new EventEmitter<string>();
  @Output() onMoveMessage = new EventEmitter<MessageMove>();

  // List of messages that will actually be shown to the user
  messagesList: ContentItemMessageModel[] = [];
  messageBeingMoved: ContentItemMessageModel;

  constructor() {
  }

  ngOnInit() {
    console.log('CIM List - Init', this.messages);
    this.redraw();
  }

  ngOnChanges() {
    console.log('CIM List - Changes detected', this.messages);
    this.redraw();
  }

  // Updates the message list with the view the user wants to see
  public redraw(hideMessagesInThePast?: boolean) {
    console.log('CIM List - Redraw', this.messages);
    // HACK: Make sure we are showing the right items
    if (hideMessagesInThePast !== undefined) {
      this.hideSentMessages = hideMessagesInThePast;
    }

    if (this.messages && this.messages.length > 0) {

      if (this.showDates) {
        // Sort the messages by date
        this.messagesList = this.sortMessages();
      } else {
        // Show all messages as dates are not important
        this.messagesList = this.messages;
      }
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

  onDragStart(event: any, message: ContentItemMessageModel) {
    this.messageBeingMoved = message;
  }

  allowDrop(event: any, message: ContentItemMessageModel) {
    if (this.messageBeingMoved) {
      if (this.messageBeingMoved.Id !== message.Id) {
        // The drop target doesn't have the same ID as the one being moved. Allow drop
        event.preventDefault();
      }
    }
  }

  onDrop(event: any, message: ContentItemMessageModel) {
    // Find indexes
    const sourceIndex = this.messages.findIndex(m => m.Id === this.messageBeingMoved.Id);
    const targetIndex = this.messages.findIndex(m => m.Id === message.Id);

    // Make sure the move is valid
    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) { return; }

    // Emit the event to move the items
    this.onMoveMessage.emit(new MessageMove(sourceIndex, targetIndex));
  }
}

// Extend the Content item message model with a boolean to show if it has already been sent
export class ShowContentItemMessageModel extends ContentItemMessageModel {
  hasBeenSent: boolean;
}

export class MessageMove {
  sourceIndex: number;
  targetIndex: number;

  constructor(source: number, target: number) {
    this.sourceIndex = source;
    this.targetIndex = target;
  }
}