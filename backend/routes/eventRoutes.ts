import express from 'express';
import { checkPSK } from '../middleware/checkPSK';
import { ingestEvents } from '../controllers/eventsController';


//initialize router
const router = express.Router();

//define routes
router.post('/events', checkPSK, ingestEvents);

export default router;
