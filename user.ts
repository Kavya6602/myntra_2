import db from './db';
// import { QueryColumns } from 'pg-promise';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken';
import { logRequest, addRequestId } from './middleware';


export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, offset } = req.query;
      
        const query = 'SELECT * FROM get_users($1, $2)';
        const result = await db.any(query, [limit, offset]);

        res.status(200).send({ message: "All data returned", result: result });

    } catch (e: any) {
        const error = e as Error;
        console.error(error.message);
        res.status(500).send(error.message);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, is_active, email, password } = req.body;

        if (!name || !is_active || !email || !password) {
            return res.status(400).json({ message: 'Name, Active status, Email and Password are all required' });
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Execute the function directly
        const query = 'SELECT * from register_user($1, $2, $3, $4)';
        const result = await db.query(query, [name, is_active, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully', result: result[0] });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.JWT_SECRET_KEY as string;
     
        // Validate the fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const query = `SELECT * FROM login_user($1, $2)`;
        const result = await db.query(query, [email, password]);

        if (result.length === 0) {
            throw new Error('User not found');
        }

        const storedHashedPassword = result[0].password;

        const match = await bcrypt.compare(password, storedHashedPassword);

        if (match) {
            const token = jwt.sign({ user_id: result[0].user_id }, secretKey, { expiresIn: '1h' });

            res.status(200).json({
                message: "Successful login",
                user_id: result[0].user_id,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const otp = () => Math.floor(1000 + Math.random() * 9000);
        const otpCall = otp();
        const { email } = req.body;

        if (!email) {
            res.status(400).send({ message: 'Email field is required' });
            return;
        }
        // Call the function
        const query = `SELECT * from forgot_password($1,$2)`

        const result = await db.any(query, [email, otpCall]);
        console.log(result)

        res.status(200).send({ message: `A one-time password has been sent to your email address ${email}`, result: result[0] });
    } catch (e: any) {
        const error = e as Error
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            res.status(400).send({ message: "Please provide all the details" });
            return;
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);

        // Call the function
        const query = `SELECT * from reset_password($1, $2, $3)`
        const [result] = await db.any(query, [email, otp, hashedPassword]);
        
        res.status(200).send({ message: "Password changed successfully", result: result[0] });
    } catch (e) {
        const error = e as Error
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};


router.get('/users', addRequestId, logRequest, getUser);
router.post('/register', addRequestId, logRequest, register);
router.post('/login', addRequestId, logRequest, login);
router.post('/forgotpassword', addRequestId, logRequest, forgotPassword);
router.post('/resetpassword', addRequestId, logRequest, resetPassword);

export { router } 
