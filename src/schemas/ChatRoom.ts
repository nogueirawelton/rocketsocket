import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { User } from "./User";

type ChatRoom = Document & {
  idUsers: typeof User[];
  idChatRoom: string;
}

const ChatRoomSchema = new Schema({
  idUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  idChatRoom: {
    type: String,
    default: uuidv4
  }
})

export const ChatRoom = mongoose.model<ChatRoom>("ChatRooms", ChatRoomSchema);