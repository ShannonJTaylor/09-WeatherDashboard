import { Router, Request, Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (_req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  res.send("City weather data");
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  //logic to get search history
  res.json({ message: "Fetching search history..." });
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  //logic to delete city from search history
  res.json({ message: `Deleting city with ID: ${req.params.id}` });
});

export default router;
