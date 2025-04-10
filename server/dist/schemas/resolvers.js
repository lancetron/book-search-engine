"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
// filepath: server/src/schemas/resolvers.ts
const User_js_1 = __importDefault(require("../models/User.js"));
const auth_js_1 = require("../services/auth.js");
exports.resolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return yield User_js_1.default.findById(context.user._id).populate('savedBooks');
        }),
    },
    Mutation: {
        login: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { email, password }) {
            const user = yield User_js_1.default.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            const isValidPassword = yield user.isCorrectPassword(password);
            if (!isValidPassword) {
                throw new Error("Invalid password");
            }
            const token = (0, auth_js_1.signToken)(user.username, user.email, user._id);
            return { token, user };
        }),
        addUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { username, email, password }) {
            const user = yield User_js_1.default.create({ username, email, password });
            const token = (0, auth_js_1.signToken)(user.username, user.email, user._id);
            return { token, user };
        }),
        saveBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const updatedUser = yield User_js_1.default.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
            return updatedUser;
        }),
        removeBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { bookId }, context) {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const updatedUser = yield User_js_1.default.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
            return updatedUser;
        }),
    },
};
