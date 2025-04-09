import User from '../../../models/User';

export const getUsers = async () => {
  return await User.find();
};

export const createUser = async (name, email) => {
  const user = new User({ name, email });
  await user.save();
  return user;
};
