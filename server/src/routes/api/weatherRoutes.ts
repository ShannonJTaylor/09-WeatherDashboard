//import { Router, Request, Response } from 'express';
import express from 'express';
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';


const router = express.Router();

// TODO: GET search history

router.post('/weather', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    // Get the weather data from your weather service (API call)
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    if (!weatherData) {
      return res.status(404).json({ message: "City not found" });
    }

    await HistoryService.addCity(cityName); // Add the city to the search history
    return res.json(weatherData); // Return the weather data as an array
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching weather data' });
  }
})

router.get('/weather/history', async (_req, res) => {
  //logic to get search history
  try {
    const history =  await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching search history:", err);
    return res.status(500).json({ message: "Error fetching search history" }); //Send an error response
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/weather/history/:id', async (_req, res) => {
  const { id } = _req.params;
 
  try {
    const success = await HistoryService.removeCity(id);
    if (!success) {
      return res.status(404).json({ message: "City with ID ${id} not found" });
    }
    
    return res.json({ message: `Deleted city with ID: ${id}` });
  } catch (err) {
    console.error("Error deleting city from search history:", err);
    return res.status(500).json({ message: "Error deleting city from search history" }); //Send an error response
  }
});

export default router;
