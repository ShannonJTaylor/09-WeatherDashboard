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
  private apiBaseURL: string;
  
  
  
  constructor() {
    this.apiBaseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';

    console.log('API Base URL:', this.apiBaseURL);
    console.log('API Key:', this.apiKey);
  }
  // TODO: Create fetchLocationData method based on city name
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(cityName)      //`${this.apiBaseURL.replace('/data/2.5', '')}/geo/1.0/direct?q=${cityName}&appid=${this.apiKey}`;
    console.log(`Fetching geolocationdata from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding API failes: ${response.statusText}');

    const data = (await response.json()) as GeocodeResponse[];

    if (!data.length) throw new Error('City not found in geocoding API');
    
    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string):string {
    return `${this.apiBaseURL.replace('/data/2.5', '')}/geo/1.0/direct?q=${cityName}&appid=${this.apiKey}`;
  }
    
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lng,
    };
  }  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.apiBaseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;    
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    console.log(`Fetching weather data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API failed: ${response.statusText}');
    return response.json();
  }
      
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.city.name,
      response.list[0].current.temp,      
      response.list[0].current.humidity,
      response.list[0].current.wind.speed,
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(0, 5).map((data:any) => new Weather( 
      data.dt_txt,  // Timestamp for the forecast
      data.main.temp,
      data.main.humidity,
      data.wind.speed,   
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
