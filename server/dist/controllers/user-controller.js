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
exports.deleteBook = exports.saveBook = exports.login = exports.createUser = exports.getSingleUser = void 0;
// import user model
const User_js_1 = __importDefault(require("../models/User.js"));
// import sign token function from auth
const auth_js_1 = require("../services/auth.js");
// get a single user by either their id or their username
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield User_js_1.default.findOne({
        $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
    });
    if (!foundUser) {
        return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }
    return res.json(foundUser);
});
exports.getSingleUser = getSingleUser;
// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_js_1.default.create(req.body);
    if (!user) {
        return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = (0, auth_js_1.signToken)(user.username, user.password, user._id);
    return res.json({ token, user });
});
exports.createUser = createUser;
// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_js_1.default.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
    }
    const correctPw = yield user.isCorrectPassword(req.body.password);
    if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
    }
    const token = (0, auth_js_1.signToken)(user.username, user.password, user._id);
    return res.json({ token, user });
});
exports.login = login;
// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
const saveBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_js_1.default.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
});
exports.saveBook = saveBook;
// remove a book from `savedBooks`
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield User_js_1.default.findOneAndUpdate({ _id: req.user._id }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
});
exports.deleteBook = deleteBook;
