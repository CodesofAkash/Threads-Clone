# Threads Clone

A full-stack social media application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication (signup/login)
- Create, read, update, delete posts
- Real-time messaging with Socket.io
- User profiles and followers
- Image uploads with Cloudinary
- Responsive design with Chakra UI

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Chakra UI
- Recoil (State Management)
- Socket.io Client
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Cloudinary (Image Storage)
- bcrypt (Password Hashing)

## 📝 Environment Variables

Add these environment variables to your Vercel dashboard:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - JWT secret key for token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Set to "production" for production deployment

## 🚀 Deployment

This project is configured for Vercel deployment with both frontend and backend in a single repository.

### Deploy to Vercel:
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🏃‍♂️ Running Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd threads-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   - Create `.env` files in both `backend` and `frontend` directories
   - Add your environment variables

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
threads-clone/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── atoms/
│   │   ├── hooks/
│   │   └── config/
│   └── dist/
├── vercel.json
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
