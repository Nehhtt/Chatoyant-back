import Room from '../models/room.model';
import User from '../models/user.model';

export default {
  roomAuthCheck: async (req, res, next) => {
    const currentUser = await User.findOne({
      $or: [{ email: req.user.email }, { userName: req.user.userName }],
    });
    const currentRoom = await Room.findOne({ roomName: req.body.roomName });
    if (!currentRoom) {
      return res.status(404).json({
        status: 'error',
        error: {
          message: `${req.body.roomName} not found`,
        },
      });
    }
    const userInRoom = currentRoom.members.find(
      (member) => member._id === currentUser._id,
    );
    if (userInRoom < 0) {
      return res.status(401).json({
        status: 'error',
        error: {
          message: 'Unauthorized user action',
        },
      });
    }
    return next();
  },
};
