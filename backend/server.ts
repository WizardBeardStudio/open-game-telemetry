//import express and dotenv
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

//import routes
import eventRoutes from './routes/eventRoutes'

//app initialization
const app = express();
const port = process.env.PORT;
app.use(express.json());

//use routes
app.use('/api/telemetry', eventRoutes);

//listen
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
