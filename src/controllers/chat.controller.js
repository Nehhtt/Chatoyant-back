import debug from 'debug';
import { ApplicationError } from '../helpers/errors';
import Chat from '../models/chat.model';
import Room from '../models/room.model';

const DEBUG = debug('dev');

export default {
  createChat: async (req, res, next) => {
    try {
      const currentRoom = await Room.findOne({ roomName: req.body.roomName });
      const isChatUnique = await Chat.findOne({ chatName: req.body.chatName });

      if (isChatUnique) {
        return res.status(409).json({
          status: 'error',
          error: {
            message: 'ChatName already taken',
          },
        });
      }

      const newChat = new Chat({
        chatName: req.body.chatName,
        chat: [],
        room: currentRoom,
      });

      currentRoom.chats = [...currentRoom.chats, newChat];
      currentRoom.save();
      newChat.save();
      res.status(200).json({
        status: 'success',
        data: newChat,
      });
      return next();
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
};
