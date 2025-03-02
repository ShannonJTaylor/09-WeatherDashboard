import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
  toString(): string {
    return `Temperature: ${this.temperature}°F, Description: ${this.description}, Humidity: ${this.humidity}%, Wind Speed: ${this.windSpeed} mph`;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';    
  }
  // TODO: Create fetchLocationData method based on city name
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeQuery = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeQuery);
    const data = await response.json();
    return data;
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
    return `${this.baseURL}/weather?q=${cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;    
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.current.temp,
      response.current.weather[0].description,
      response.current.humidity,
      response.current.wind_speed,
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(0, 5).map((data:any) => new Weather(
      data.main.temp, 
      data.weather[0].description, 
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
