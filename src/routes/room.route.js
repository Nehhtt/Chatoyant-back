import { Router } from 'express';
import catchAsync from '../middleware/catchAsync';
import authentication from '../middleware/authenticate';
import roomController from '../controllers/room.controller';
import chatController from '../controllers/chat.controller';
import roomAuth from '../middleware/roomAuth';

const {
  createChat, deleteChat,
} = chatController;

const {
  getUserRooms, createRoom, deleteRoom, inviteUser, kickUser,
} = roomController;

const { authenticate } = authentication;
const { roomAuthCheck } = roomAuth;
const roomRouter = Router();

roomRouter.get('/getRoom', authenticate, catchAsync(getUserRooms));
roomRouter.post('/createRoom', authenticate, catchAsync(createRoom));
roomRouter.delete('/deleteRoom', authenticate, roomAuthCheck, catchAsync(deleteRoom));

roomRouter.post('/inviteUser', authenticate, roomAuthCheck, catchAsync(inviteUser));
roomRouter.post('/kickUser', authenticate, roomAuthCheck, catchAsync(kickUser));

roomRouter.post('/createChat', authenticate, roomAuthCheck, catchAsync(createChat));
roomRouter.delete('/deleteChat', authenticate, roomAuthCheck, catchAsync(deleteChat));

export default roomRouter;
