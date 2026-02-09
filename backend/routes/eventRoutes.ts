import express from 'express';
import { ingestEvents } from '../controllers/eventsController';


//initialize router
const router = express.Router();

//define routes
router.post('/events', ingestEvents);

export default router;
