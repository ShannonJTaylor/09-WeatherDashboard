import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req: Request, res: Response) => {
  try {
    const { cityName } = _req.body; //Get the city name from the request body
    if (!cityName) {
      return res.status(400).json({ message: "City name is required" }); //Send a 400 response if city name is missing
    }
    const weatherData = await WeatherService.getWeatherForCity(cityName); //Get the weather data for the city
    if (!weatherData) {
      return res.status(404).json({ message: "City not found" }); //Send a 404 response if city is not found
    }

    await HistoryService.addCity(cityName); //Add the city to the search history
    return res.json(weatherData); //Send the weather data as a JSON response
  } catch (err) {
    console.error("Error processing POST request:", err);
    return res.status(500).json({ error: "Failed to retrieve or save weather data" }); //Send an error response
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  //logic to get search history
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.error("Error fetching search history:", err);
    res.status(500).json({ message: "Error fetching search history" }); //Send an error response
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
 
  try {
    const { id } = req.params;
     //logic to delete city from search history
     await HistoryService.removeCity(id);
      res.json({ message: `Deleting city with ID: ${id}` });
  } catch (err) {
    console.error("Error deleting city from search history:", err);
    res.status(500).json({ message: "Error deleting city from search history" }); //Send an error response
  }
});

export default router;
