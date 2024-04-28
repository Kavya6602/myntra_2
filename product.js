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
exports.router = exports.getAllProducts = exports.getProductById = void 0;
const db_1 = __importDefault(require("./db"));
const express_1 = __importDefault(require("express"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const middleware_1 = require("./middleware");
const router = express_1.default.Router({ mergeParams: true });
exports.router = router;
const pgp = (0, pg_promise_1.default)();
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ error: "Product ID required" });
            return;
        }
        console.log(id);
        const query = `SELECT * FROM get_product_by_id($1)`;
        const products = yield db_1.default.any(query, [id]);
        console.log(products.length);
        if (products.length === 0) {
            res.status(404).send({ error: "Product not found" });
            return;
        }
        res.status(200).send({ message: 'Success', product: products[0] });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal server error' });
    }
    next();
});
exports.getProductById = getProductById;
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, minPrice, maxPrice, limit, offset } = req.query;
        const query = `select get_all_products($1, $2, $3, $4, $5)`;
        const products = yield db_1.default.any(query, [
            type || null,
            minPrice || null,
            maxPrice || null,
            limit || null,
            offset || null
        ]);
        res.status(200).json({ message: 'All products', result: products });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getAllProducts = getAllProducts;
router.get('/product/:id', middleware_1.addRequestId, middleware_1.logRequest, exports.getProductById);
router.get('/products', middleware_1.addRequestId, middleware_1.logRequest, exports.getAllProducts);
