import express from 'express';
import { checkAdmin } from '../middleware/checkAdmin';
import { addProvider } from '../controllers/authProvidersController';

//initialize router
const router = express.Router();

//define routes
router.get('/addProvider', checkAdmin, addProvider);


export default router;
