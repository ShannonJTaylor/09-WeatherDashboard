import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

dotenv.config();

// Import the routes
import routes from './index';

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));


// TODO: Implement middleware for parsing JSON and url encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(routes);

// Route all other requests to the frontend index.html (important for React routing)
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
  
  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // TODO: Implement middleware to connect the routes
// app.use(routes);

// // Start the server on the port
// app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
