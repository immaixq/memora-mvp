
# Memora 🌟

A playful, mobile-first platform where communities can share favorite places, food stalls, quotes, and memories. Users can engage through responses, polls, and upvotes, creating a vibrant space for community connection.

## ✨ Features

- **Text & Poll Prompts**: Create questions with open-ended text responses or structured polls
- **Community Engagement**: Upvote responses and participate in polls
- **Firebase Authentication**: Secure login with Google OAuth and email/password
- **Mobile-First Design**: Responsive interface optimized for mobile devices  
- **Real-time Updates**: Live voting and response updates
- **Content Moderation**: Built-in reporting system for community safety

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Axios** for API calls

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** database
- **Prisma** ORM for database operations
- **Firebase Admin** for authentication
- **Helmet** & **CORS** for security
- **Rate limiting** for API protection

### Infrastructure
- **GitHub Actions** CI/CD pipeline
- **Docker** containerization
- **Vercel** deployment (frontend)
- **Render/Railway** deployment (backend)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18+ installed
- **PostgreSQL** 15+ running locally or access to a managed instance
- **Firebase** project with Authentication enabled
- **Git** for version control

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd peeps
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

#### Required Environment Variables (Backend)

```env
DATABASE_URL="postgresql://mai:5432@localhost:5432/memora_dev"
PORT=3001
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

#### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Optional: Seed the database
npm run db:seed
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

#### Required Environment Variables (Frontend)

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🏃‍♂️ Running the Application

### Development Mode

Start both backend and frontend in development mode:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

### Using Docker Compose

For a complete local environment with PostgreSQL:

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your Firebase configuration
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📚 API Documentation

### Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### Core Endpoints

#### Prompts

- `GET /api/prompts` - List prompts with pagination and filtering
- `GET /api/prompts/:id` - Get prompt details with responses
- `POST /api/prompts` - Create new prompt
- `POST /api/prompts/:id/vote` - Vote on poll option

#### Responses

- `POST /api/responses` - Create response to text prompt
- `POST /api/responses/:id/upvote` - Toggle upvote on response

#### Reports

- `POST /api/reports` - Report inappropriate content

### Example API Calls

```javascript
// Create a text prompt
POST /api/prompts
{
  "title": "Best coffee shops in downtown?",
  "body": "Looking for cozy places to work from",
  "type": "TEXT"
}

// Create a poll prompt
POST /api/prompts
{
  "title": "Favorite pizza topping?",
  "type": "POLL",
  "pollOptions": ["Pepperoni", "Margherita", "Hawaiian", "Veggie"]
}

// Vote on poll
POST /api/prompts/abc123/vote
{
  "pollOptionId": "def456"
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run component tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests (if configured)
npm run test:e2e
```

### Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend  
npm run lint
npm run lint:fix
```

## 🚀 Deployment

### Environment Setup

Create the following GitHub secrets for automated deployment:

#### Vercel (Frontend)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

#### Render/Railway (Backend)
- `RENDER_PRODUCTION_DEPLOY_HOOK`
- `RENDER_STAGING_DEPLOY_HOOK`

#### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Manual Deployment

#### Frontend (Vercel)

```bash
cd frontend
npm run build
npx vercel --prod
```

#### Backend (Render/Railway)

Connect your GitHub repository to your hosting provider and configure:

- Build command: `cd backend && npm run build`
- Start command: `cd backend && npm start`
- Environment variables from your `.env` file

## 📁 Project Structure

```
peeps/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── schemas/        # Zod validation schemas
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── main.tsx        # React entry point
│   └── package.json
├── .github/
│   └── workflows/          # CI/CD pipeline
├── docker-compose.yml      # Local development environment
└── README.md
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes and add tests**
4. **Run linting and tests**: `npm run lint && npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write tests for new features
- Keep components small and focused
- Use semantic commit messages

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -d memora_dev -h localhost -p 5432

# Reset database
cd backend
npm run db:migrate:reset
```

#### Firebase Authentication Errors
- Verify Firebase project configuration
- Check that Authentication is enabled in Firebase console
- Ensure service account has proper permissions

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .vite
npm run build
```

### Getting Help

- **Issues**: Report bugs at [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: Join conversations at [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: Check the `/docs` folder for detailed guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for authentication infrastructure
- **Prisma** for excellent TypeScript ORM
- **Vercel** and **Render** for deployment platforms
- **Tailwind CSS** for rapid UI development
- **Framer Motion** for smooth animations

---

**Built with ❤️ for community connection**
  