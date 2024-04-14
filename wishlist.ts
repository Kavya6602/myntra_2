import db  from './db';
// import pgPromise from 'pg-promise';
// const pgp = pgPromise();
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { logRequest,addRequestId } from './middleware';

export const getAllWishlist = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const { limit, offset } = req.query;

        if (!limit || !offset) {
            throw new Error(`Both limit and offset must be provided.`);
        }

        const query = 'SELECT * FROM get_all_wishlist($1, $2)';
        const results = await db.any(query, [limit || null, offset || null]);

        res.status(200).send({ message: "Successful", result: results });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
    next()
}

export const deleteWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send('ID is required');
            return;
        }
        const query = `select delete_wishlist($1)`
        const result = await db.one(query, [id]);

        res.status(200).send({ message: 'Deleted Successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal server error' });
    }
    next()
};

export const addWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, product_id, is_active, quantity } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required." })
        }

        const query = `select add_wishlist($1, $2, $3, $4)`;
       const result =  await db.one(query, [user_id, product_id, is_active, quantity]);

        res.status(201).send({ message: "Created Successfully!",result:result });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
    }
    next()
}

export const updateWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const { user_id, product_id } = req.params;

        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const query = `select update_wishlist($1,$2,$3)`;

        const [results] = await db.any(query, [user_id, product_id,quantity]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User or product not found in wishlist" });
        }

        res.status(200).json({ message: 'Successfully updated' });
    } catch (e: any) {
        const error = e as Error
        console.error(error);
        res.status(500).json({ message: error.message });
    }
    next()
};


router.get('/wishlist',addRequestId,logRequest,getAllWishlist);
router.delete('/wishlist/:id',addRequestId,logRequest, deleteWishlist);
router.post('/wishlist',addRequestId,logRequest,addWishlist);
router.put('/wishlist/:user_id/:product_id',addRequestId,logRequest,updateWishlist)

export { router }