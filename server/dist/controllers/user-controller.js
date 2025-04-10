var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import user model
import User from '../models/User.js';
// import sign token function from auth
import { signToken } from '../services/auth.js';
// get a single user by either their id or their username
export const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield User.findOne({
        $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
    });
    if (!foundUser) {
        return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }
    return res.json(foundUser);
});
// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.create(req.body);
    if (!user) {
        return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = signToken(user.username, user.password, user._id);
    return res.json({ token, user });
});
// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
    }
    const correctPw = yield user.isCorrectPassword(req.body.password);
    if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
    }
    const token = signToken(user.username, user.password, user._id);
    return res.json({ token, user });
});
// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
});
// remove a book from `savedBooks`
export const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield User.findOneAndUpdate({ _id: req.user._id }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
});
