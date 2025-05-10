import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/env';
import admissioRoutes from './presentation/routes/admissionRoutes';

const app = express();


app.use(express.json());


app.use('/api', admissioRoutes);


mongoose.connect(config.mongoUri)
.then((() => console.log('Mongodb connected')))
.catch((err) => console.log(err));

export default app;
