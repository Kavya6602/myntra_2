import  db from './db';
import express, { Router,Request,Response,NextFunction } from 'express';
import pgPromise from 'pg-promise';
import { logRequest, addRequestId } from './middleware';
const router: Router = express.Router({ mergeParams: true });
const pgp = pgPromise()

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ error: "Product ID required" });
            return;
        }
        const query = `SELECT * FROM get_product_by_id($1)`;
        const products = await (db as any).any(query, [id]);
        if (products.length === 0) {
            res.status(404).send({ error: "Product not found" });
            return;
        }

        res.status(200).send({ message: 'Success', product: products[0] });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal server error' });
    }
    next()
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, minPrice, maxPrice, limit, offset } = req.query;

        const query = `select get_all_products($1, $2, $3, $4, $5)`

        const products = await (db as any).any(query, [
            type || null,
            minPrice || null,
            maxPrice || null,
            limit || null,
            offset || null
        ]);

        res.status(200).json({ message: 'All products', result: products });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


router.get('/product/:id', addRequestId, logRequest, getProductById);
router.get('/products', addRequestId, logRequest, getAllProducts)

export { router };
