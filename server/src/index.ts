import { Router } from 'express';


import apiRoutes from './routes/api/weatherRoutes';
import htmlRoutes from './routes/htmlRoutes';


const router = Router();
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
