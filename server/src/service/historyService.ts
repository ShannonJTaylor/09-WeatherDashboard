//import { error } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath  } from 'url'; //Import for ES module compatibility
import { v4 as uuidv4 } from 'uuid';

//Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filePath = path.join(__dirname, '../../data/searchHistory.json');


// TODO: Define a City class with name and id properties
class City {
  constructor(
    public name: string,
    public id: string
  ) {}
}


// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      //If data is empty return an empty array
      if (!data) {
        return [];
      }
      return JSON.parse(data); //Return the parsed data as an array of City objects
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; //If the file doesn't exist, return an empty array
    }
    throw err; //If there's an error other than the file not existing, throw the error
  }
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(cities, null, 2)); //Format the data with 2 spaces for indentation
    } catch (err) {
      throw err; //Handle error during write
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return await this.read(); //Call the read method to get the cities
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(cityName: string): Promise<void> {
    const city = new City(cityName, uuidv4()); //Create a new City object with a unique id
    const cities = await this.read(); //Get the current cities
    cities.push(city); //Add the new city to the array
    await this.write(cities); //Write the updated array back to the file
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: string): Promise<void> {
    const cities = await this.read(); //Get the current cities
    const updatedCities = cities.filter((city) => city.id !== id); //Filter out the city with the matching id
    await this.write(updatedCities); //Write the updated array back to the file
    }
  }


export default new HistoryService();
