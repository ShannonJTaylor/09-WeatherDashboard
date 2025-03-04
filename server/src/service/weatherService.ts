import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

// TODO: Define an interface for the Coordinates object
type Coordinates = {
  lat: number;
  lon: number;
}

interface GeocodeResponse extends Coordinates {}

// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  temperature: number;    
  humidity: number;
  windSpeed: number;

  constructor(cityName: string, temperature: number, humidity: number, windSpeed: number) {
    this.cityName = cityName;
    this.temperature = temperature;    
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
  toString(): string {
    return `City: ${this.cityName}, Temperature: ${this.temperature}°F, Humidity: ${this.humidity}%, Wind Speed: ${this.windSpeed} mph`;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private apiKey: string;
  private geocodeBaseURL: string;
  private weatherBaseURL: string;
  
  
  constructor() {
    this.geocodeBaseURL = process.env.GEOCODE_BASE_URL || '';
    this.weatherBaseURL = process.env.WEATHER_BASE_URL || '';    
    this.apiKey = process.env.WEATHER_API_KEY || '';    
  }
  // TODO: Create fetchLocationData method based on city name
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(cityName);
    const response = await fetch(url);

    if (!response.ok) throw new Error('Geocoding API failes: ${response.statusText}');

    const data = (await response.json()) as GeocodeResponse[];

    if (!data.length) throw new Error('City not found in geocoding API');
    
    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }
    
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.results[0].geometry.location.lat,
      lon: locationData.results[0].geometry.location.lng,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string): string {
    return `${this.geocodeBaseURL}/weather?q=${cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.weatherBaseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;    
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API failed: ${response.statusText}');
    return response.json();
  }
      
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.cityName,
      response.current.temp,      
      response.current.humidity,
      response.current.windSpeed,
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(0, 5).map((data:any) => new Weather(
      data.cityName,
      data.main.temp,       
      data.main.humidity, 
      data.wind.speed    
    ));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      //Fetch and destructure location data
      const coordinates = await this.fetchAndDestructureLocationData(city);
      //Fetch weather data using coordinates
      const weatherData = await this.fetchWeatherData(coordinates);
      //Parse current weather data
      const currentWeather = this.parseCurrentWeather(weatherData);
      //Build teh forecast array usikng the forecast data
      const forecast = this.buildForecastArray(weatherData.daily); // Using `daily` for forecast
      //Return the current weather and foreccast array
      return [currentWeather, ...forecast];
    } catch (error) {
      throw new Error('Failed to retrieve weather data');
    }
  }
}


export default new WeatherService();
