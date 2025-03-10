import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';

dotenv.config();

// Import the routes
import routes from './index';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,    
}));

app.use((_req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline';");
    next();
  });
  


// TODO: Implement middleware for parsing JSON and url encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(routes);

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
console.log('Serving static files from:', path.join(__dirname, '..', '..', 'client', 'dist'));


// Route all other requests to the frontend index.html (important for React routing)
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  });
  
  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));