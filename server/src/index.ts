import { Router } from 'express';
const router = Router();

import apiRoutes from './routes/api/weatherRoutes';
import htmlRoutes from './routes/htmlRoutes';

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
