# TravelHub Frontend

A modern, responsive React frontend for the TravelHub travel booking platform. This application provides a complete interface for tourists, guides, and administrators to manage tours, bookings, payments, and more.

## Features

### 🎯 Core Functionality
- **Multi-role Authentication**: Separate login/registration for tourists, guides, and admins
- **Tour Management**: Browse, create, and manage tours with full CRUD operations
- **Booking System**: Complete booking workflow with payment integration
- **User Management**: Admin panel for managing all user types
- **Payment Processing**: Track and manage payment transactions
- **Notifications**: Send and manage system notifications
- **Responsive Design**: Mobile-first design that works on all devices

### 👥 User Roles

#### Tourists
- Browse available tours
- Book tours and make payments
- View booking history
- Rate and review tours

#### Guides
- Create and manage tours
- View booking statistics
- Update tour availability
- Manage tour details

#### Admins
- Manage all users (tourists, guides, admins)
- Oversee all tours and bookings
- Process payments and refunds
- Send system notifications
- View platform analytics

### 🛠️ Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons
- **React Hook Form** for form management
- **Axios** for API communication
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Setup

The frontend is configured to connect to the backend API at `http://localhost:5000`. If your backend runs on a different port, update the `API_BASE_URL` in `src/services/api.ts`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Main navigation component
│   └── LoadingSpinner.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Authentication pages
│   ├── Register.tsx
│   ├── Tours.tsx       # Tour browsing
│   ├── TourDetail.tsx  # Individual tour view
│   ├── MyBookings.tsx  # Tourist booking management
│   ├── Dashboard.tsx   # Guide dashboard
│   └── admin/          # Admin pages
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       ├── TourManagement.tsx
│       ├── PaymentManagement.tsx
│       └── NotificationManagement.tsx
├── services/           # API service layer
│   └── api.ts         # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
├── App.tsx            # Main app component with routing
└── index.tsx          # App entry point
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /tourists/login` - Tourist login
- `POST /tourists` - Tourist registration
- `POST /guides/login` - Guide login
- `POST /guides` - Guide registration
- `POST /admins/login` - Admin login

### Tours
- `GET /tours` - Get all tours
- `GET /tours/:id` - Get tour by ID
- `POST /tours` - Create tour (guides/admins)
- `PUT /tours/:id` - Update tour
- `DELETE /tours/:id` - Delete tour (super admin)

### Bookings
- `POST /booking` - Create booking (tourists)
- `GET /booking` - Get user's bookings
- `PUT /booking/:id` - Update booking
- `DELETE /booking/:id` - Cancel booking

### Payments
- `POST /payments` - Create payment
- `GET /payments` - Get all payments (admins)
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### User Management
- `GET /tourists` - Get all tourists (admins)
- `GET /guides` - Get all guides (admins)
- `GET /admins` - Get all admins (super admin)
- CRUD operations for each user type

### Notifications
- `POST /notifications` - Create notification (admins)
- `GET /notifications` - Get all notifications
- `PUT /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Protected routes for different user types
- Automatic token refresh and logout

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Accessible components with Headless UI
- Dark/light mode support ready

### 🎨 Modern UI/UX
- Clean, intuitive interface
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions

### 🔧 Developer Experience
- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot reloading for development
- Comprehensive error handling

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

### Production Build

1. Create a production build:
```bash
npm run build
```

2. The build folder contains the optimized production build ready for deployment.

### Environment Variables

For production deployment, you may want to set these environment variables:

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENVIRONMENT` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.