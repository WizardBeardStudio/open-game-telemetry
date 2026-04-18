//import express and dotenv
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";

//import routes
import eventRoutes from './routes/eventRoutes'

//app initialization
const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    credentials: true,               
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//----ROUTES----

//auth routes
app.all('/api/auth/{*any}', toNodeHandler(auth(process.env.BETTER_AUTH_TRUSTED_ORIGINS!)));

//health check
app.get('/', (req, res) => {
  res.status(200).send('API is healthy');
});

//telemetry event routes
app.use('/api/telemetry', eventRoutes);

//listen
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
