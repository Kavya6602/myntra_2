import express from 'express';
import { router as productRouter } from './product';
import { router as userRouter } from './user';
import { router as wishlistRouter} from './wishlist.js';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();
app.use(bodyParser.json())

app.use('/',productRouter);
app.use('/',userRouter);
app.use('/',wishlistRouter);

app.listen(3001, ()=>{ console.log('Server is running') })