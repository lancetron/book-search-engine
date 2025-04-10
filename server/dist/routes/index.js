"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const index_js_1 = __importDefault(require("./api/index.js"));
router.use('/api', index_js_1.default);
// serve up react front-end in production
router.use((_req, res) => {
    res.sendFile(node_path_1.default.join(__dirname, '../../client/build/index.html'));
});
exports.default = router;
