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
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const connection_js_1 = __importDefault(require("./config/connection.js"));
const typeDefs_1 = require("./schemas/typeDefs");
const resolvers_1 = require("./schemas/resolvers");
const index_js_1 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const server = new server_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
});
await server.start();
app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
    context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) { return ({ user: req.user }); }),
}));
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(node_path_1.default.join(__dirname, '../client/build')));
}
app.use(index_js_1.default);
connection_js_1.default.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
