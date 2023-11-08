const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
// userRouter.patch('/me', updateUser);
// userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
