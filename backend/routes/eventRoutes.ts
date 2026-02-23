import express from 'express';
import { checkPSK } from '../middleware/checkPSK';
import { ingestEvents, fetchEvents } from '../controllers/eventsController';


//initialize router
const router = express.Router();

//define routes
router.get('/events', checkPSK, fetchEvents);
router.post('/events', checkPSK, ingestEvents);

export default router;
