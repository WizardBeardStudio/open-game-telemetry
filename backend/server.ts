//import express and dotenv
import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import dotenv from 'dotenv';
dotenv.config();

//import routes
import eventRoutes from './routes/eventRoutes'

//app initialization
const app = express();
const port = process.env.PORT;
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

//use routes
app.use('/api/telemetry', eventRoutes);

//listen
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
