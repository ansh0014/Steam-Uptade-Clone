# Steam Clone

A modern Steam clone with React frontend and Express backend featuring mock game data and simulated purchasing.

## Features

- Authentic Steam look and feel
- Browse games by category
- View game details
- Add games to cart
- Multiple payment methods (Credit/Debit Card, Net Banking, UPI)
- Simulated transaction processing
- Responsive design

## Technologies Used

- React
- TypeScript
- Express
- Tailwind CSS
- Shadcn UI

## Running the Application

### Prerequisites

- Node.js 18 or higher
- npm

### Development Mode

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```

### Using Docker

The application can be containerized using Docker:

1. Build and start the Docker container
   ```
   docker-compose up -d
   ```

2. Access the application at http://localhost:5000

3. Stop the Docker container
   ```
   docker-compose down
   ```

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express API
- `shared/` - Shared types and schemas

## Building for Production

```
npm run build
```

The production build will be available in the `dist/` directory.
