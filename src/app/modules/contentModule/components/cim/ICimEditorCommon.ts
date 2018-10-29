import { ContentItemMessageModel } from 'services/content-item.service';

export interface ICimEditorCommon {
    // The editor must reset itself
    reset();

    // The user wants to edit an existing message
    edit(message: ContentItemMessageModel);
}