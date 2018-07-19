import { ContentItemMessageModel } from "services/content-item.service";

// Provides a set of default methods all message forms must supply
export interface IContentItemMessageForm {
    resetForm();
    editMessage(message: ContentItemMessageModel);
}