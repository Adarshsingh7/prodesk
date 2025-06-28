import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("Message", messageSchema);

export default Message;
