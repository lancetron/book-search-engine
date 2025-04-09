// filepath: server/src/schemas/resolvers.ts
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: any }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return await User.findById(context.user._id).populate('savedBooks');
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await user.isCorrectPassword(password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: unknown, { input }: { input: any }, context: { user: any }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: { user: any }) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};