# University Academy - Frontend

A modern, responsive web application built with React and TypeScript for managing university academy operations. Features a clean, intuitive interface for students, faculty, and administrators.

## 🚀 Technology Stack

- **Framework**: React 19.x with TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Custom components with Tailwind CSS
- **Charts**: Chart.js + Recharts
- **Real-time**: Socket.io client
- **Authentication**: Firebase
- **Payment**: Stripe integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with ES6+ support

## 🛠️ Installation

1. **Clone the repository and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root directory with the following variables:
   ```env
   # API Configuration
   VITE_API_BASE_URL="http://localhost:3000/api/v1"
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   
   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   
   # Feature Flags
   VITE_ENABLE_PWA="true"
   VITE_ENABLE_ANALYTICS="false"
   ```

## 🚀 Available Scripts

- **Development**: `npm run dev` - Start development server with hot reload
- **Build**: `npm run build` - Build the project for production
- **Preview**: `npm run preview` - Preview production build locally
- **Lint**: `npm run lint` - Run ESLint for code quality
- **Generate SW**: `npm run generate-sw` - Generate service worker

## 🏗️ Project Structure

```
src/
├── application/          # Application logic, hooks, and services
├── appStore/            # Redux store and slices
├── domain/              # Type definitions and validation schemas
├── frameworks/          # Core framework configurations
├── presentation/        # UI components and pages
├── services/            # API services and external integrations
├── shared/              # Common components, utilities, and constants
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔧 Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Web App**: Service worker for offline functionality
- **Real-time Updates**: Live notifications and chat features
- **Role-based Access**: Different interfaces for students, faculty, and admins
- **Form Validation**: Robust form handling with Zod schemas
- **State Management**: Centralized state with Redux Toolkit
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, accessible interface components
- **Payment Integration**: Stripe payment processing
- **File Management**: Document upload and management
- **Analytics**: Chart.js integration for data visualization

## 🎨 UI Components

The application includes:
- **Layout Components**: Header, sidebar, navigation
- **Form Components**: Input fields, buttons, modals
- **Data Display**: Tables, cards, lists
- **Interactive Elements**: Dropdowns, date pickers, file uploads
- **Feedback Components**: Toasts, alerts, loading states

## 📱 Responsive Design

- **Mobile**: Optimized for small screens
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured interface for large screens
- **Touch-friendly**: Optimized for touch interactions

## 🔐 Authentication & Authorization

- **Firebase Authentication**: Phone, email, and social login
- **JWT Tokens**: Secure API communication
- **Role-based Access**: Different permissions for different user types
- **Session Management**: Persistent login states

## 🌐 API Integration

- **RESTful APIs**: Communication with backend services
- **Real-time Updates**: WebSocket connections for live data
- **Error Handling**: Comprehensive error management
- **Request/Response Interceptors**: Centralized API configuration

## 🚀 Getting Started

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Development: `http://localhost:5173`
   - The app will automatically open in your default browser

3. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Development Guidelines

- Follow React best practices and hooks
- Use TypeScript for type safety
- Implement responsive design principles
- Follow accessibility guidelines
- Write clean, maintainable components
- Use proper error boundaries and loading states

## 🔒 Security Features

- Environment variable protection
- Input validation and sanitization
- Secure authentication flows
- HTTPS enforcement in production
- XSS protection measures

## 📚 Dependencies

Major dependencies include:
- React 19 for UI framework
- Vite for build tooling
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Axios for HTTP requests
- Firebase for authentication
- Chart.js for data visualization

For a complete list, see `package.json`.

## 🌟 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 PWA Features

- Service worker for offline functionality
- App manifest for installability
- Push notifications support
- Background sync capabilities
