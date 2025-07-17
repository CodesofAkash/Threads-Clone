# Threads Clone

A full-stack social media application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login)
- Create, like, and reply to posts
- Follow/unfollow users
- Real-time messaging
- Image uploads
- Profile management
- Responsive design

## Tech Stack

**Frontend:**
- React 18
- Vite
- Chakra UI
- Socket.io-client
- Zustand (state management)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT authentication
- Cloudinary (image uploads)

## Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally
- Cloudinary account for image uploads

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGO_URI=mongodb://localhost:27017/threads-clone
   JWT_SECRET=your-jwt-secret-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment (Railway)

1. Connect your repository to Railway
2. Set the following environment variables in Railway:
   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. Deploy from the `backend` directory

### Frontend Deployment (Vercel)

1. Connect your repository to Vercel
2. Set the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `frontend`

3. Set the following environment variables in Vercel:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.railway.app
   VITE_SOCKET_URL=https://your-backend-domain.railway.app
   ```

4. Deploy the frontend

## Project Structure

```
├── backend/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database connection
│   ├── middlewares/    # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── socket/         # Socket.io configuration
│   └── utils/          # Helper functions
├── frontend/
│   ├── src/
│   │   ├── atoms/      # Zustand state management
│   │   ├── components/ # React components
│   │   ├── config/     # API configuration
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   └── pages/      # Page components
│   └── public/         # Static assets
```

## API Configuration

The frontend uses environment variables for API configuration:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_SOCKET_URL`: Socket.io server URL

For local development, these default to `http://localhost:5000`.
For production, set them to your deployed backend URL.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
