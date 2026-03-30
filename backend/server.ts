//import express and dotenv
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

//import routes
import eventRoutes from './routes/eventRoutes'
import { send } from 'process';

//app initialization
const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,               
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


//----ROUTES----

//auth routes
app.all('/api/auth/{*any}', toNodeHandler(auth));

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
