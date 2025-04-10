var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// filepath: server/src/schemas/resolvers.ts
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
export const resolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return yield User.findById(context.user._id).populate('savedBooks');
        }),
    },
    Mutation: {
        login: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { email, password }) {
            const user = yield User.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            const isValidPassword = yield user.isCorrectPassword(password);
            if (!isValidPassword) {
                throw new Error("Invalid password");
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        }),
        addUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { username, email, password }) {
            const user = yield User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        }),
        saveBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const updatedUser = yield User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
            return updatedUser;
        }),
        removeBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { bookId }, context) {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const updatedUser = yield User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
            return updatedUser;
        }),
    },
};
