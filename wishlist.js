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
exports.router = exports.updateWishlist = exports.addWishlist = exports.deleteWishlist = void 0;
const db_1 = __importDefault(require("./db"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const middleware_1 = require("./middleware");
const getAllWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset } = req.query;
        console.log(limit, offset);
        if (!limit || !offset) {
            throw new Error(`Both limit and offset must be provided.`);
        }
        const query = 'SELECT * FROM get_all_wishlist($1, $2)';
        const results = yield db_1.default.any(query, [limit, offset]);
        console.log(results.length);
        res.status(200).send({ message: "Successful", result: results });
    }
    catch (e) {
        const error = e;
        console.error(error);
        res.status(500).send({ message: error });
    }
    next();
});
const deleteWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send('ID is required');
            return;
        }
        const query = `select delete_wishlist($1)`;
        const result = yield db_1.default.one(query, [id]);
        res.status(200).send({ message: 'Deleted Successfully' });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal server error' });
    }
    next();
});
exports.deleteWishlist = deleteWishlist;
const addWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, product_id, is_active, quantity } = req.body;
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required." });
        }
        const query = `select add_wishlist($1, $2, $3, $4)`;
        const result = yield db_1.default.one(query, [user_id, product_id, is_active, quantity]);
        res.status(201).send({ message: "Created Successfully!", result: result });
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
    }
    next();
});
exports.addWishlist = addWishlist;
const updateWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const { user_id, product_id } = req.params;
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }
        const query = `select update_wishlist($1,$2,$3)`;
        const [results] = yield db_1.default.any(query, [user_id, product_id, quantity]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User or product not found in wishlist" });
        }
        res.status(200).json({ message: 'Successfully updated' });
    }
    catch (e) {
        const error = e;
        console.error(error);
        res.status(500).json({ message: error.message });
    }
    next();
});
exports.updateWishlist = updateWishlist;
router.get('/wishlist', middleware_1.addRequestId, middleware_1.logRequest, getAllWishlist);
router.delete('/wishlist/:id', middleware_1.addRequestId, middleware_1.logRequest, exports.deleteWishlist);
router.post('/wishlist', middleware_1.addRequestId, middleware_1.logRequest, exports.addWishlist);
router.put('/wishlist/:user_id/:product_id', middleware_1.addRequestId, middleware_1.logRequest, exports.updateWishlist);
