"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("./product");
const user_1 = require("./user");
const wishlist_js_1 = __importDefault(require("./wishlist.js"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(body_parser_1.default.json());
app.use('/', product_1.router);
app.use('/', user_1.router);
app.use('/', wishlist_js_1.default);
app.listen(3000, () => { console.log('Server is running'); });
