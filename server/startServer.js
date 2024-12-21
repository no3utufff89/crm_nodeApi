import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from '../routes/userRouter.js';
import categoryRouter from '../routes/categoryRouter.js';
import { errMiddleware } from '../middleware/error-middleware.js';

const PORT = process.env.PORT || 3000;
export const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173'],

}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('static'));
// Маршруты
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use(errMiddleware);
export const startApp = async () => {
    try {
        app.listen(PORT, () =>
            console.log(
                `Server started on port: ${PORT}, address is: http://localhost:${PORT}`
            )
        );
       
    } catch (e) {
        console.log(`e`, e);
    }
};
