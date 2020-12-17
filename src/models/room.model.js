import mongoose from 'mongoose';
import Chat from './chat.model';

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

roomSchema.pre('deleteOne', { document: true }, async function deleteChats(next) {
  const currentRoom = this;
  const chatsId = currentRoom.chats.map((chat) => chat._id);

  await Chat.deleteMany({ _id: { $in: chatsId } });
  return next();
});

// eslint-disable-next-line no-use-before-define
roomSchema.statics.checkExistingField = async (field, value) => Room.findOne({ [`${field}`]: value });

const Room = mongoose.model('Room', roomSchema);

export default Room;
