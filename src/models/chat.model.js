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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
