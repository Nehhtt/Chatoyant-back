import debug from 'debug';
import { ApplicationError } from '../helpers/errors';
import Chat from '../models/chat.model';
import Room from '../models/room.model';
import User from '../models/user.model';

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
  deleteChat: async (req, res) => {
    try {
      const currentRoom = await Room.findOne({ roomName: req.body.roomName });
      const currentChat = await Chat.findOne({ chatName: req.body.chatName });
      const currentUser = await User.findOne({
        $or: [{ email: req.user.email }, { userName: req.user.userName }],
      });
      if (!currentUser) {
        return res.status(404).json({
          status: 'error',
          error: {
            message: `${!req.user.email ? req.user.userName : req.user.email} user not found.`,
          },
        });
      }
      if (currentUser !== currentRoom.owner) {
        return res.status(401).json({
          status: 'error',
          error: {
            message: 'Unauthorized user action',
          },
        });
      }
      currentRoom.chats.splice(currentRoom.chats.findIndex((chat) => chat === currentChat), 1);
      currentRoom.save();
      return res.status(200).json({
        status: 'success',
        message: `${!req.body.chatName} deleted from "${req.body.roomName}" sucessfully`,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
};
