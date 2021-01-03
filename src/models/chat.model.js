import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: [true, 'Chat name is required'],
    unique: true,
  },
  chat: [{
    message: {
      type: String,
    },
    sender: {
      type: String,
    },
    date: {
      type: String,
    },
  }],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
