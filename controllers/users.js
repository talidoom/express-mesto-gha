const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Ошибка на стороне севера', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    console.log(req.body);
    return res.status(200).send(await newUser.save());
  } catch (error) {
    console.log(error.code);
  }
};

const getUserById = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = await User.findById(idUser);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
};
