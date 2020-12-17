import debug from 'debug';
import { ApplicationError } from '../helpers/errors';
import Room from '../models/room.model';
import User from '../models/user.model';

const DEBUG = debug('dev');

export default {
  getUserRooms: async (req, res, next) => {
    try {
      const currentUser = await User.findOne({
        $or: [{ email: req.user.email }, { userName: req.user.userName }],
      });
      const rooms = await Room.find({ members: currentUser });

      res.status(200).json({
        status: 'success',
        data: {
          rooms,
        },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
    return next();
  },
  createRoom: async (req, res, next) => {
    try {
      const checkRoomName = await Room.checkExistingField('roomName', req.body.roomName);

      if (checkRoomName) {
        return res.status(409).json({
          status: 'error',
          error: {
            message: 'RoomName already taken',
          },
        });
      }
      const currentUser = await User.findOne({
        $or: [{ email: req.user.email }, { userName: req.user.userName }],
      });
      const newRoom = new Room({
        roomName: req.body.roomName,
        owner: currentUser,
        members: [currentUser],
        chats: [],
      });
      newRoom.save();
      res.status(200).json({
        status: 'success',
        data: newRoom,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
    return next();
  },
  deleteRoom: async (req, res, next) => {
    try {
      const currentRoom = await Room.findOne({ roomName: req.body.roomName });
      await currentRoom.deleteOne();

      res.status(200).json({
        status: 'success',
        message: `${req.body.roomName} delete with success`,
      });
      next();
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  inviteUser: async (req, res, next) => {
    try {
      const invitedUser = await User.findOne({
        $or: [{ email: req.body.email }, { userName: req.body.userName }],
      });
      if (!invitedUser) {
        return res.status(404).json({
          status: 'error',
          error: {
            message: `${!req.user.email ? req.user.userName : req.user.email} user not found.`,
          },
        });
      }
      const currentRoom = await Room.findOne({ roomName: req.body.roomName });
      currentRoom.members = [...currentRoom.members, invitedUser];
      currentRoom.save();
      res.status(200).json({
        status: 'success',
        message: `${!req.user.email ? req.user.userName : req.user.email} invited to "${req.body.roomName}" sucessfully`,
      });
      return next();
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
};
